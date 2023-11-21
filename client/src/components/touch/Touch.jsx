import React, { useRef, useState } from 'react'
import StudentNavbar from '../StudentDashBoard/StudentNavbar/StudentNavbar'
import Navbar from '../Navbar/Navbar'
import emailjs from "@emailjs/browser";

const Touch = () => {
    const ref = useRef();
    const [isSuccess, setIsSuccess] = useState(null);
  

    const handleSubmit = (e) => {
      e.preventDefault();
  
      emailjs
        .sendForm("service_gzh980i",
        "template_2ird4ma",
          ref.current,
          "ciSdL3aLgl1jdHimy"
        )
        .then(
          (result) => {
            console.log(result.text);
            setIsSuccess(true);
            ref.current = null;
          },
          (error) => {
            console.log(error.text);
            setIsSuccess(false);
          }
        );
    };
  
    return (
        <>
            <StudentNavbar />
        <div className="container mt-6">
            <h1 className="text-center text-4xl bg-gradient-to-b from-purple-600 to-white bg-clip-text text-transparent mb-10">
            Lets keep in touch
            </h1>
            <div className="flex items-center gap-10">
            <div className="flex-1 relative h-78 w-48">
                <img
                src="https://lambtonstories.vercel.app/_next/image?url=%2Fcontact.png&w=3840&q=75"
                alt="contact image"
                className="object-contain animate-move"
                />
            </div>
            <form
                ref={ref}
                className="flex-1 flex flex-col gap-5"
                onSubmit={handleSubmit}
            >
                <input
                type="text"
                className="bg-transparent text-white p-2 border-2 outline-none border-gray-500 font-bold text-xl"
                placeholder="name"
                name="name"
                />
                <input
                type="email"
                className="bg-transparent text-white p-2 border-2 outline-none border-gray-500 font-bold text-xl"
                placeholder="email"
                name="email"
                />
                <textarea
                name="message"
                placeholder="message"
                className="bg-transparent text-white p-2 border-2 outline-none border-gray-500 font-bold text-xl"
                cols="30"
                rows="10"
                ></textarea>
                <button
                type="submit"
                className="bg-purple-600 text-white p-3 font-bold text-xl cursor-pointer"
                >
                SEND
                </button>
                {isSuccess && (
                <span className="text-green-500 text-sm">
                    Your Message has been sent. We will get back to you soon
                </span>
                )}
            </form>
            </div>
      </div>
      </>
    );
}

export default Touch