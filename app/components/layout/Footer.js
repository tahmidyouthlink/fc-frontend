import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import logoWhiteImage from "/public/logos/fc-logo.png";
import { FaEnvelope, FaInstagram, FaLinkedin, FaSquareFacebook, FaTiktok, FaXTwitter, FaYoutube } from 'react-icons/fa6';

const Footer = () => {
  return (
    <div className='px-5 2xl:px-0 bg-[#F7F7F7]'>
      <div className='flex flex-col lg:flex-row justify-between lg:items-center max-w-[1200px] mx-auto pt-12 pb-6 gap-6'>
        <div>
          <Link href="/">
            <div className="flex items-center gap-2">
              <Image
                className="h-6 w-auto"
                src={logoWhiteImage}
                alt="fashion-commerce logo with white text"
              />
              <h1 className="font-leckerli text-lg">F-Commerce</h1>
            </div>
          </Link>
        </div>
        <div>
          <ul className='flex flex-col lg:flex-row lg:items-center justify-center gap-2 text-xs xl:text-[13x] text-[#5B5B5B]'>
            <li className='hover:text-[#000000]'>
              <Link href="/about-us">About Us</Link>
            </li>
            <li className='hover:text-[#000000]'>
              <Link href="/terms">Terms & Conditions</Link>
            </li>
            <li className='hover:text-[#000000]'>
              <Link href="/privacy-policy">Privacy Policy</Link>
            </li>
            <li className='hover:text-[#000000]'>
              <Link href="/shipping-policy">Shipping Policy</Link>
            </li>
            <li className='hover:text-[#000000]'>
              <Link href="/return-policy">Return Policy</Link>
            </li>
            <li className='hover:text-[#000000]'>
              <Link href="/faq">FAQ</Link>
            </li>
            <li className='hover:text-[#000000]'>
              <Link href="/contact-us">Contact Us</Link>
            </li>
          </ul>
        </div>
        <div>
          <ul className="social-icons flex gap-x-1.5">
            <li>
              <Link
                className="hover:bg-[#cfe6ff] hover:text-[#0080ff]"
                href="https://www.facebook.com/fashion-commerce/" target="_blank"
              >
                <FaSquareFacebook />
              </Link>
            </li>
            <li>
              <Link
                className="from-[#405de6] via-[#dc2743] to-[#f09433] hover:bg-gradient-to-b hover:text-white"
                href="https://www.instagram.com/fashion-commerce/" target="_blank"
              >
                <FaInstagram />
              </Link>
            </li>
            {/* <li>
              <Link
                className="hover:bg-[#c8ecff] hover:text-[#0075b4]"
                href="https://www.linkedin.com/fashion-commerce/" target="_blank"
              >
                <FaLinkedin />
              </Link>
            </li> */}
            <li>
              <Link
                className="hover:bg-black hover:text-white"
                href="https://www.twitter.com/fashion-commerce/" target="_blank"
              >
                <FaXTwitter />
              </Link>
            </li>
            <li>
              <Link
                className="hover:bg-black hover:text-white"
                href="https://www.tiktok.com/fashion-commerce/" target="_blank"
              >
                <FaTiktok />
              </Link>
            </li>
            <li>
              <Link
                className="hover:bg-[#ffcacb] hover:text-[#ff0f1c]"
                href="https://www.youtube.com/@fashion-commerce" target="_blank"
              >
                <FaYoutube />
              </Link>
            </li>
            <li>
              <Link
                className="hover:bg-neutral-800 hover:text-neutral-100"
                href="mailto:info@fashion-commerce"
              >
                <FaEnvelope />
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className='max-w-[1200px] mx-auto'>
        <hr />
      </div>
      <div className='py-3 lg:py-4 xl:py-5 2xl:py-6 flex flex-col lg:flex-row justify-between items-center  max-w-[1200px] mx-auto'>
        <p className="py-3 lg:py-4 xl:py-5 2xl:py-6 text-center text-[13px] md:text-[14px]">
          Copyright ©{" "}
          <Link className="font-bold" href="/">
            F-Commerce
          </Link>{" "}
          - {new Date().getFullYear()}. All Rights Reserved.
        </p>
        <div className='text-[14px]'>Developed by <span className='font-bold'>YouthLink Tech.</span></div>
      </div>
    </div>
  );
};

export default Footer;