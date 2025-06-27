// import React, { useEffect, useState } from "react"
// // Import Swiper React components
// import { Swiper, SwiperSlide } from "swiper/react"

// // Import Swiper styles
// import "swiper/css"
// import "swiper/css/free-mode"
// import "swiper/css/pagination"
// // import "../../.."
// // Import required modules
// import { FreeMode, Pagination } from "swiper"

// // import { getAllCourses } from "../../services/operations/courseDetailsAPI"
// import Course_Card from "./Course_Card"


// //This goes above the Course_Slider component
// const getLoopedCourses = (courses) => {
//   if (!courses || courses.length === 0) return []
//   if (courses.length < 3) {
//     // Repeat the array until there are at least 6 slides for smoother looping
//     const repeatCount = Math.ceil(6 / courses.length)
//     return Array(repeatCount).fill(courses).flat()
//   }
//   return courses
// }


// function Course_Slider({ Courses }) {
//   const loopedCourses = getLoopedCourses(Courses)

//   return (
//     <>
//       {loopedCourses.length ? (
//         <Swiper
//           spaceBetween={25}
//           loop={true}
//           modules={[FreeMode, Pagination]}
//           pagination={{ clickable: true }}
//           breakpoints={{
//             320: { slidesPerView: 1 },
//             640: { slidesPerView: 1.2 },
//             768: { slidesPerView: 2 },
//             1024: { slidesPerView: 3 },
//           }}
//           className="max-h-[30rem]"
//         >
//           {loopedCourses.map((course, i) => (
//             <SwiperSlide key={course._id || i}>
//               <Course_Card course={course} Height={"h-[250px]"} />
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       ) : (
//         <p className="text-xl text-richblack-5">No Course Found</p>
//       )}
//     </>
//   )
// }


// export default Course_Slider


import React from "react"
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"

// Import Swiper styles
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import "swiper/css/autoplay"

// Import required modules
import { FreeMode, Pagination, Autoplay } from "swiper"

import Course_Card from "./Course_Card"

// Helper to repeat courses if they are too few
const getLoopedCourses = (courses) => {
  if (!courses || courses.length === 0) return []
  if (courses.length < 5) {
    const repeatCount = Math.ceil(10 / courses.length)
    return Array(repeatCount).fill(courses).flat()
  }
  return courses
}

function Course_Slider({ Courses }) {
  const loopedCourses = getLoopedCourses(Courses)

  return (
    <>
      {loopedCourses.length ? (
        <Swiper
          spaceBetween={25}
          loop={true}
          loopedSlides={loopedCourses.length}
          loopAdditionalSlides={loopedCourses.length}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{ clickable: true }}
          modules={[FreeMode, Pagination, Autoplay]}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 1.2 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="max-h-[30rem]"
        >
          {loopedCourses.map((course, i) => (
            <SwiperSlide key={course._id || i}>
              <Course_Card course={course} Height={"h-[250px]"} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-xl text-richblack-5">No Course Found</p>
      )}
    </>
  )
}

export default Course_Slider
