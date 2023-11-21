import React from "react";
import bitlogo from "../../assets/svgs/footer_logo.png";
function Footer() {
  return (
    <div>
      <footer class="bg-white dark:bg-gray-900">
        <div class="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
          <div class="md:flex md:justify-between">
            <div class="mb-6 md:mb-0">
             {/* <a href="https://flowbite.com/" class="flex items-center"> */}
                <img src={bitlogo} class="h-8 mr-3" alt="FlowBite Logo" />
                <span class="self-center text-sm font-semibold whitespace-nowrap dark:text-white">
                  Sticky Subscription System
                </span>
              {/* </a> */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
