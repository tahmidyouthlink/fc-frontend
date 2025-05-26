"use client";

import { useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import StoryHero from "@/app/components/story/StoryHero";
import StoryDetails from "@/app/components/story/StoryDetails";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

const departments = [
  {
    _id: "661cbf3f1b2c4d001c7e1a01",
    name: "CEO",
    coverImgSrc: "/story/cards/beast.jpg",
    workSummary:
      "Overseeing the entire project, making executive decisions, and ensuring the website aligns with the vision and business goals.",
    staff: {
      name: "John Doe",
      imgSrc: "/story/staff/1.webp",
    },
    contents: [
      {
        mediaSrc: "/story/videos/1.mp4",
        hashtag: "#Impact",
        quote:
          "<p>The website has a <span>huge potential</span> to change the <span>fashion e-commerce</span> space.</p>",
      },
      {
        mediaSrc: "/story/images/content-img-1.jpg",
        hashtag: "#Dedication",
        quote:
          "<p>Our team is working <span>tirelessly</span> to make it happen, and I'm <span>excited</span> for what's to come.</p>",
      },
    ],
  },
  {
    _id: "661cbf3f1b2c4d001c7e1a02",
    name: "Developer",
    coverImgSrc: "/story/cards/crow.webp",
    workSummary:
      "Building the backend and frontend, ensuring smooth interactions, user authentication, and performance optimization for a seamless experience.",
    staff: {
      name: "Alice Smith",
      imgSrc: "/story/staff/2.webp",
    },
    contents: [
      {
        mediaSrc: "/story/videos/2.mp4",
        hashtag: "#Innovation",
        quote:
          "<p>Our <span>development team</span> is ensuring the website is as <span>fast</span> as it is <span>beautiful</span>.</p>",
      },
      {
        mediaSrc: "/story/images/content-img-1.jpg",
        hashtag: "#Experience",
        quote:
          "<p>We're focusing on making sure it's a <span>smooth experience</span> for users no matter their <span>device</span>.</p>",
      },
      {
        mediaSrc: "/story/images/content-img-2.jpg",
        hashtag: "#Challenge",
        quote:
          "<p>It's an <span>exciting challenge</span> to <span>optimize</span> every feature to <span>perfection</span>!</p>",
      },
    ],
  },
  {
    _id: "661cbf3f1b2c4d001c7e1a03",
    name: "Designer",
    coverImgSrc: "/story/cards/snatch.jpg",
    workSummary:
      "Designing the website interface and user experience, creating visual elements that resonate with our brand and attract customers.",
    staff: {
      name: "Rachel Green",
      imgSrc: "/story/staff/3.webp",
    },
    contents: [
      {
        mediaSrc: "/story/videos/3.mp4",
        hashtag: "#Leadership",
        quote:
          "<p><span>Fashion</span> is all about <span>expression</span>, and our website design reflects that.</p>",
      },
      {
        mediaSrc: "/story/images/content-img-1.jpg",
        hashtag: "#Style",
        quote:
          "<p>We've worked hard to make sure every page feels as <span>stylish</span> as our <span>clothes</span>.</p>",
      },
      {
        mediaSrc: "/story/images/content-img-2.jpg",
        hashtag: "#Impact",
        quote:
          "<p>Our design is about making an <span>impact</span> the moment someone lands on the site.</p>",
      },
    ],
  },
  {
    _id: "661cbf3f1b2c4d001c7e1a04",
    name: "Clothing Department",
    coverImgSrc: "/story/cards/eighteen.jpg",
    workSummary:
      "Curating fashion collections, selecting the best pieces for the seasons, and ensuring that we're offering a variety of styles for different tastes.",
    staff: {
      name: "Mark Johnson",
      imgSrc: "/story/staff/4.webp",
    },
    contents: [
      {
        mediaSrc: "/story/videos/4.mp4",
        hashtag: "#Changemakers",
        quote:
          "<p>We're always looking for the <span>next big trend</span>. <span>Fashion</span> is fast-paced, and we ensure we stay <span>ahead</span> of the curve.</p>",
      },
      {
        mediaSrc: "/story/images/content-img-1.jpg",
        hashtag: "#Collection",
        quote:
          "<p>It's <span>thrilling</span> to see our <span>collection</span> come to life on the website.</p>",
      },
      {
        mediaSrc: "/story/images/content-img-2.jpg",
        hashtag: "#Precision",
        quote:
          "<p>Every item we select is chosen with <span>care</span> and <span>precision</span>.</p>",
      },
    ],
  },
  {
    _id: "661cbf3f1b2c4d001c7e1a05",
    name: "Fashion Department",
    coverImgSrc: "/story/cards/milton-glaser.jpg",
    workSummary:
      "Providing fashion insights, guiding trends, and working closely with the clothing department to ensure each piece aligns with current fashion movements.",
    staff: {
      name: "Sophia Carter",
      imgSrc: "/story/staff/5.webp",
    },
    contents: [
      {
        mediaSrc: "/story/videos/5.mp4",
        hashtag: "#Progress",
        quote:
          "<p>It's an <span>exciting time</span> for <span>fashion</span>, and our role is to bring the <span>freshest trends</span> to our customers.</p>",
      },
      {
        mediaSrc: "/story/images/content-img-1.jpg",
        hashtag: "#Trends",
        quote:
          "<p>Our team works hard to ensure that what you see online is the <span>latest</span> and <span>greatest</span>.</p>",
      },
      {
        mediaSrc: "/story/images/content-img-2.jpg",
        hashtag: "#Leader",
        quote:
          "<p>We're all about <span>setting the trend</span>, not just following it.</p>",
      },
    ],
  },
  {
    _id: "661cbf3f1b2c4d001c7e1a06",
    name: "Marketing Department",
    coverImgSrc: "/story/cards/noir.jpg",
    workSummary:
      "Promoting the brand, increasing visibility, and ensuring that we reach the right audience with impactful marketing strategies.",
    staff: {
      name: "Liam Davis",
      imgSrc: "/story/staff/6.webp",
    },
    contents: [
      {
        mediaSrc: "/story/videos/6.mp4",
        hashtag: "#Purpose",
        quote:
          "<p><span>Marketing</span> is all about <span>connecting</span> with people, and we're focused on making sure we reach those who will love our <span>fashion</span>.</p>",
      },
      {
        mediaSrc: "/story/images/content-img-1.jpg",
        hashtag: "#Creative",
        quote:
          "<p>Through <span>creative campaigns</span>, we're making sure the world knows about our <span>brand</span>.</p>",
      },
      {
        mediaSrc: "/story/images/content-img-2.jpg",
        hashtag: "#Reach",
        quote:
          "<p>Our job is to ensure that <span>fashion lovers</span> find us wherever they are.</p>",
      },
    ],
  },
  {
    _id: "661cbf3f1b2c4d001c7e1a07",
    name: "EDM Department",
    coverImgSrc: "/story/cards/edm.jpg",
    workSummary:
      "Focusing on the technical side of the website's experience, from creating interactive elements to ensuring that the shopping experience is optimized for the user.",
    staff: {
      name: "Ethan Wright",
      imgSrc: "/story/staff/7.webp",
    },
    contents: [
      {
        mediaSrc: "/story/videos/7.mp4",
        hashtag: "#Empowerment",
        quote:
          "<p>The <span>integration</span> of <span>dynamic content</span> is key to enhancing the <span>user experience</span>.</p>",
      },
      {
        mediaSrc: "/story/images/content-img-1.jpg",
        hashtag: "#Performance",
        quote:
          "<p>Our job is to ensure everything <span>runs smoothly</span>, especially with features like <span>product galleries</span> and animations.</p>",
      },
      {
        mediaSrc: "/story/images/content-img-2.jpg",
        hashtag: "#UX",
        quote:
          "<p>A <span>seamless experience</span> is vital for keeping <span>customers engaged</span>.</p>",
      },
    ],
  },
  {
    _id: "661cbf3f1b2c4d001c7e1a08",
    name: "Customer Support",
    coverImgSrc: "/story/cards/wet.webp",
    workSummary:
      "Ensuring a smooth post-purchase experience for customers, solving issues and queries, and maintaining positive customer relationships.",
    staff: {
      name: "Olivia Brown",
      imgSrc: "/story/staff/8.webp",
    },
    contents: [
      {
        mediaSrc: "/story/videos/8.mp4",
        hashtag: "#Solutions",
        quote:
          "<p><span>Customer service</span> is about building <span>trust</span> and providing help when needed the most.</p>",
      },
      {
        mediaSrc: "/story/images/content-img-1.jpg",
        hashtag: "#Care",
        quote:
          "<p>We're always ready to <span>assist</span> our customers, ensuring they have the <span>best experience</span> with us.</p>",
      },
    ],
  },
  {
    _id: "661cbf3f1b2c4d001c7e1a09",
    name: "Logistics Department",
    coverImgSrc: "/story/cards/faces.jpg",
    workSummary:
      "Managing the inventory, ensuring timely delivery of products, and coordinating with suppliers to keep the stock updated.",
    staff: {
      name: "Michael Lee",
      imgSrc: "/story/staff/9.webp",
    },
    contents: [
      {
        mediaSrc: "/story/videos/9.mp4",
        hashtag: "#Transformation",
        quote:
          "<p>Behind the scenes, we're ensuring that everything <span>arrives on time</span> and in <span>perfect condition</span> for our customers.</p>",
      },
      {
        mediaSrc: "/story/images/content-img-1.jpg",
        hashtag: "#Experience",
        quote:
          "<p><span>Logistics</span> is a crucial part of the <span>customer experience</span>, and we take it seriously.</p>",
      },
      {
        mediaSrc: "/story/images/content-img-2.jpg",
        hashtag: "#Delivery",
        quote:
          "<p>We work hard to make sure every <span>order</span> reaches its <span>destination</span> without a hitch.</p>",
      },
    ],
  },
];

export default function OurStory() {
  const [selectedDept, setSelectedDept] = useState(null);

  return (
    <main
      id="story-main"
      className="pt-header-h-full-section-pb relative bg-neutral-50 pb-[var(--section-padding)] text-sm text-neutral-500 md:text-base xl:min-h-dvh [&_h2]:text-neutral-600"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="fixed left-[5%] top-[25%] animate-blob bg-[var(--color-moving-bubble-secondary)] max-sm:hidden" />
        <div className="fixed left-[30%] top-[60%] animate-blob bg-[var(--color-moving-bubble-primary)] [animation-delay:1.5s]" />
        <div className="fixed left-[55%] top-[5%] animate-blob bg-[var(--color-moving-bubble-secondary)] [animation-delay:0.5s] sm:bg-[var(--color-moving-bubble-primary)]" />
        <div className="fixed left-[80%] top-[70%] animate-blob bg-[var(--color-moving-bubble-secondary)] [animation-delay:2s] max-sm:hidden" />
      </div>
      {!selectedDept ? (
        <StoryHero
          gsap={gsap}
          useGSAP={useGSAP}
          departments={departments}
          setSelectedDept={setSelectedDept}
        />
      ) : (
        <StoryDetails
          gsap={gsap}
          useGSAP={useGSAP}
          selectedDept={selectedDept}
          setSelectedDept={setSelectedDept}
        />
      )}
    </main>
  );
}
