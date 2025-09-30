export function Hero() {
    return (
        <div className="w-full flex flex-col gap-6 pt-24 sm:pt-32 md:pt-40 lg:pt-48 xl:pt-[200px] pb-16 sm:pb-20 md:pb-24 lg:pb-[100px]">
            {/*          <p className="text-pink-100 text-[14px] lg:text-[16px] font-geist-sans font-medium leading-[150%] text-gray-600 dark:text-gray-300 w-full text-left max-w-[640px]">
                A new home for digital portfolios
            </p> */}

            <h1 className="text-[32px] sm:text-[36px] md:text-[40px] lg:text-[44px] xl:text-[48px] font-geist-sans font-semibold w-full min-w-[250px] text-left text-balance tracking-[-0.05em] leading-[110%] text-supergrey-100 dark:text-gray-50">
                Get feedback.
                Get upvotes.

                Get <span className="text-pink-100 dark:text-pinkdark-200">noticed.</span>
            </h1>
            <p className="text-[15px] sm:text-[16px] lg:text-[18px] xl:text-[19px] font-geist-sans font-regular leading-[140%] text-gray-500 dark:text-gray-300 w-full text-left max-w-[640px]">
                Submit your portfolio, earn upvotes and valuable feedback from the design community, help others and maximize your visibility.
            </p>
        </div>
    );
} 