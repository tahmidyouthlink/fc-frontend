import React, { useEffect, useState } from 'react';
import { GrNotification } from 'react-icons/gr';
import { Popover, PopoverTrigger, PopoverContent, useDisclosure, } from "@nextui-org/react";
import { RxCross2 } from 'react-icons/rx';
import useNotifyMeNotifications from '@/app/hooks/useNotifyMeNotifications';
import SmallHeightLoading from '../shared/Loading/SmallHeightLoading';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';

const Notifications = () => {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [notifyMeNotificationList, isNotifyMeNotificationPending] = useNotifyMeNotifications();
  const [productId, setProductId] = useState({}); // Store the fetched product names
  const axiosPublic = useAxiosPublic();
  const [showAll, setShowAll] = useState(false);

  const flattenedTimeBasedNotifications = notifyMeNotificationList?.flatMap(details =>
    details?.emails?.map(detail => ({
      _id: details?._id,
      productId: details?.productId,
      size: details?.size,
      colorCode: details?.colorCode,
      email: detail?.email,
      notified: detail?.notified,
      dateTime: detail?.dateTime,
    })
    ))

  const sortedNotifications = flattenedTimeBasedNotifications?.sort((a, b) => {
    const aLatest = Math.max(new Date(a.dateTime).getTime());
    const bLatest = Math.max(new Date(b.dateTime).getTime());
    return bLatest - aLatest;
  });

  const slicedNotifications = flattenedTimeBasedNotifications?.slice(0, 5);

  const showAllNotifications = showAll
    ? sortedNotifications || []
    : slicedNotifications || [];

  const getTimeAgo = (dateTimeStr) => {
    // Convert "May 5, 2025 | 5:50 PM" -> "May 5, 2025 5:50 PM"
    const cleanedDateStr = dateTimeStr.replace('|', '').trim();
    const past = new Date(cleanedDateStr);
    const now = new Date();

    const diffMs = now - past;
    if (isNaN(past)) return 'Invalid date';

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const months = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30));
    const years = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365));

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 30) return `${days}d ago`;
    if (months < 12) return `${months}mo ago`;
    return `${years}y ago`;
  };

  useEffect(() => {
    const fetchProductNames = async () => {
      try {
        const productIds = notifyMeNotificationList?.map(item => item.productId);

        if (!productIds || productIds.length === 0) return;

        const response = await axiosPublic.post('/getProductIds', { ids: productIds });

        if (response.status === 200) {
          const productNamesMap = response.data.reduce((acc, product) => {
            acc[product._id] = product?.productId;
            return acc;
          }, {});
          setProductId(productNamesMap);
        } else {
          console.error('Failed to fetch product ids:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching product ids:', error);
      }
    };

    fetchProductNames();
  }, [notifyMeNotificationList, axiosPublic]);

  if (isNotifyMeNotificationPending) return <SmallHeightLoading />;

  console.log(showAllNotifications, "showAllNotifications");

  return (
    <Popover isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setShowAll(false); // reset on close
          onClose();
        } else {
          onOpen();
        }
      }}
      placement="bottom-end" showArrow offset={10}>
      <PopoverTrigger>
        <div className="cursor-pointer" role="button" onClick={onOpen}>
          <GrNotification size={22} />
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-[500px] max-h-[500px] p-0">
        <div className='w-full py-4'>
          <div className='flex justify-between px-4 pb-2 border-b'>
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold">Notifications</h2>
              <h2 className="text-sm text-neutral-600">Stay updated with your latest notifications</h2>
            </div>
            <button onClick={() => {
              onClose();         // Close the popover
              setShowAll(false); // Reset showAll state
            }} className="text-gray-500 hover:text-black">
              <RxCross2 size={24} />
            </button>
          </div>
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            <div>
              {showAllNotifications?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No notifications to show.</div>
              ) : (
                showAllNotifications.map((detail, idx) => (
                  <div
                    key={`${idx}`}
                    className="px-4 py-2 border-b last:border-none cursor-pointer hover:bg-gray-50 transition"
                  >
                    <div className="flex justify-between items-center w-full">
                      <div className="w-full">
                        <div className="text-sm text-gray-700 flex flex-wrap items-center gap-x-1">
                          <span>New request for</span>
                          <span className="font-medium text-black whitespace-nowrap">
                            {productId[detail.productId] || (
                              <span className="text-gray-400">Loading product...</span>
                            )}
                          </span>
                          <span>{`,`}</span>
                          <div className="flex flex-wrap items-center text-sm text-gray-600 gap-x-1">
                            <span>Size:</span>
                            <span className="font-medium whitespace-nowrap">{detail.size}</span>
                            <span>|</span>
                            <span className="flex items-center whitespace-nowrap">
                              Color:
                              <span
                                className="w-4 h-4 ml-2 rounded-full border border-gray-300"
                                style={{ backgroundColor: detail.colorCode }}
                              ></span>
                            </span>
                          </div>
                        </div>
                        <div className='flex items-center justify-between gap-4'>
                          <p className="text-sm text-gray-500">
                            {getTimeAgo(detail.dateTime)}
                          </p>
                          <p className="flex items-center gap-1">
                            {detail.notified ? (
                              <span className="text-green-600 text-xs font-medium flex items-center">
                                ✅ Notified
                              </span>
                            ) : (
                              <span className="text-red-500 text-xs font-medium flex items-center">
                                ❌ Not Notified
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {flattenedTimeBasedNotifications.length > 5 && !showAll && (
                <div className="text-center mt-4">
                  <button
                    onClick={() => setShowAll(true)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Show all notifications
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </PopoverContent>

    </Popover>
  );
};

export default Notifications;