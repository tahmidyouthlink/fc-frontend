import OurStories from '@/app/components/dashboard-our-story/OurStories';
import OurStoryNavbar from '@/app/components/dashboard-our-story/OurStoryNavbar';
import React from 'react';

const OurStoryPage = () => {

  return (
    <div className='bg-gray-50 min-h-[calc(100vh-60px)] relative'>

      <div className="max-w-screen-2xl mx-auto px-6 md:px-10">

        <OurStoryNavbar />
        <OurStories />

      </div>

    </div>
  );
};

export default OurStoryPage;