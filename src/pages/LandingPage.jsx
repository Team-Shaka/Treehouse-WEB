import { useState } from "react";

export default function LandingPage() {
  const [isTooltipVisible, setIsTooltipVisible] = useState(true);

  const handleTooltipToggle = () => {
    setIsTooltipVisible(!isTooltipVisible);
  };

  return (
    <div className="">
      {/* Header */}
      <div className="md:p-12">
        <img
          src="/assets/treehouse_gray.svg"
          className="hidden md:flex  md:w-[136px]"
          alt="treehouse"
        />
        <div className="h-12 md:hidden" />
      </div>
      {/* Section 1 */}
      <section className="flex justify-center">
        <img
          src="/assets/landing_1.svg"
          className="w-[1480px] hidden md:flex"
          alt="landing_1"
        />
        <object
          data="/assets/landing_1_mobile.svg"
          type="image/svg+xml"
          className="w-[375px] md:hidden"
        >
          <img
            src="/assets/landing_1_mobile.svg"
            alt="landing_1_mobile"
            className="w-[375px]"
          />
        </object>
      </section>
      {/* Section 2 */}
      <section className="py-20 md:py-[280px]">
        <div className="flex justify-center items-start">
          <object
            data="/assets/landing_2.svg"
            type="image/svg+xml"
            className="w-[128px] mr-5 md:w-[280px] md:mr-[100px] block"
          >
            <img
              src="/assets/landing_2.svg"
              className="w-[128px] mr-5 md:w-[280px] md:mr-[100px]"
              alt="landing_2"
            />
          </object>
          <div className="flex flex-col pt-8">
            <div className="font-mobile-head1 text-mobile-head1 md:font-web-head1 md:text-web-head1">
              나와 너<span className="text-tree_green">, </span> 우리끼리
              <span className="text-tree_green">. </span>
            </div>
            <div className="text-gray-7 font-mobile-caption1 text-mobile-caption1 md:font-web-body1 md:text-web-body1 mt-4 md:mt-5">
              Treehouse는 전화번호를 통해서만 초대가
              <br /> 가능하고, 가입한 사람의 초대장을 통해서만
              <br /> 가입할 수 있어요.
            </div>
            <div className="flex mt-7 md:mt-20 relative">
              <div className="text-mobile-caption2 font-mobile-caption2 md:text-web-caption1 md:font-web-caption1 opacity-50">
                *초대장을 어떻게 받을 수 있나요?
              </div>
              <img
                src="/assets/icon_tooltip.svg"
                className="w-5 md:w-6 cursor-pointer"
                alt="tooltip"
                onClick={handleTooltipToggle}
              />
              {isTooltipVisible && (
                <div
                  className="flex items-start justify-between absolute left-0 top-5 md:top-8 bg-cover bg-no-repeat bg-center shadow-xl text-[9.75px] md:text-[16px] text-tree_pale w-[170px] md:w-[290px] h-[53px] md:h-[90px] pt-4 px-2 md:pt-7 md:px-4"
                  style={{ backgroundImage: "url(/assets/tooltip_box.svg)" }}
                >
                  <span>
                    {" "}
                    게시글, 댓글 작성 등<br /> 활발한 활동을 하면 그래프가
                    늘어나요!
                  </span>
                  <button onClick={handleTooltipToggle}>X</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* Section 3 */}
      <section className="flex flex-col justify-center items-center">
        <div className="font-mobile-head1 text-mobile-head1 md:font-web-head1 md:text-web-head1">
          더 다양한 우리들끼리<span className="text-tree_green">.</span>
        </div>
        <div className="text-gray-7 font-mobile-caption1 text-mobile-caption1 md:font-web-body1 md:text-web-body1 mt-2 md:mt-5">
          여러 개의 Treehouse에 초대되어 더 많은 사람들을 만나보세요.
        </div>
        <img
          src="/assets/landing_3.svg"
          className="hidden md:w-[1480px] md:mt-32 md:flex"
          alt="landing_3"
        />
        <object
          data="/assets/landing_3_mobile.svg"
          type="image/svg+xml"
          className="w-[375px] md:hidden"
        >
          <img
            src="/assets/landing_3_mobile.svg"
            className="w-[375px]"
            alt="landing_3_mobile"
          />
        </object>
      </section>
      {/* Section 4 */}
      <section className="py-14 md:py-[280px] ">
        <div
          className="flex h-[375px] md:h-[700px] justify-center bg-no-repeat bg-contain bg-center"
          style={{ backgroundImage: "url(/assets/landing_4_bg.svg)" }}
        >
          <div className="flex flex-col mr-7 md:mr-20 mt-20 md:mt-[140px] text-end">
            <div className="font-mobile-head1 text-mobile-head1 md:font-web-head1 md:text-web-head1">
              새로운 경험
              <span className="text-tree_green">, </span>
              <br className="block md:hidden" />
              새로운 연결 &nbsp;
            </div>
            <div className="text-gray-7 font-mobile-caption1 text-mobile-caption1 md:font-web-body1 md:text-web-body1 mt-5">
              Treehouse에서 서로를 연결해보세요.
              <br /> 초대를 통해 가입된 사람들이 나와 어떻게 <br /> 연결된
              관계인지 확인할 수 있어요.
            </div>
          </div>{" "}
          <object
            data="/assets/landing_4.svg"
            type="image/svg+xml"
            className="w-[128px] md:w-[280px] block"
          >
            <img
              src="/assets/landing_4.svg"
              className="w-[128px] md:w-[280px]"
              alt="landing_4"
            />
          </object>
        </div>
      </section>
      {/* Section 5 */}
      <section>
        {/* Web */}
        <div
          className="hidden md:flex md:h-[1100px] justify-center bg-no-repeat bg-container bg-center"
          style={{ backgroundImage: "url(/assets/landing_5.svg)" }}
        >
          <div className="flex flex-col items-center text-gray-white mt-24">
            <div className="font-web-head1 text-web-head1">
              글과 사진만으로는 부족하니까
            </div>
            <div className="font-web-body1 text-web-body1 text-center opacity-80 mt-5">
              Treehole에 모여 직접 이야기를 나누세요. <br />
              우리끼리 모여서 이야기를 나누고, 글을 올리고, 목소리로
              소통해보세요.
            </div>
          </div>
        </div>
        {/* Mobile */}
        <div className="relative md:hidden">
          <object
            data="/assets/landing_5_mobile.svg"
            type="image/svg+xml"
            className="absolute inset-0 w-full h-[410px] object-cover object-center"
          >
            <img
              src="/assets/landing_5_mobile.svg"
              alt="background"
              className="w-full h-[410px] object-cover object-center"
            />
          </object>
          <div className="flex h-[410px] justify-center bg-no-repeat bg-center relative z-10">
            <div className="flex flex-col items-center text-gray-white mt-10">
              <div className="font-mobile-head1 text-mobile-head1">
                글과 사진만으로는 부족하니까
              </div>
              <div className="font-mobile-caption1 text-mobile-caption1 text-center opacity-80 mt-2">
                Treehole에 모여 직접 이야기를 나누세요. <br />
                우리끼리 모여서 이야기를 나누고, 글을 올리고, 목소리로
                소통해보세요.
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Section 6 */}
      <section className="flex flex-col items-center ">
        {/* 그 누구보다 서로 연결된 Treehouse로. */}
        <img
          src="/assets/landing_6.svg"
          className="hidden md:block w-[1480px] pt-[280px] pb-[120px]"
          alt="landing_6"
        />
        <img
          src="/assets/landing_6_mobile.svg"
          className="w-[375px] md:hidden pt-[110px] pb-12"
          alt="landing_6_mobile"
        />
        <div className="font-mobile-head1 text-mobile-text1 md:font-web-head1 md:text-web-head1">
          Treehouse는
          <span className="text-tree_green"> 8월 중 출시될 예정</span>입니다.
        </div>
        <div className="font-mobile-caption1 text-mobile-cap md:font-web-body1 md:text-web-body1 text-gray-8 mt-2">
          *iOS만 가능합니다. Android는 추후 추가 개발 예정입니다.
        </div>
        <img
          src="/assets/landing_6_divider.svg"
          className="mt-28 hidden md:block"
        />
        <img
          src="/assets/landing_6_divider_mobile.svg"
          className="mt-16 md:hidden"
        />

        <button className="rounded-full bg-tree_green w-52 h-14 md:w-96 md:h-24 text-gray-white text-[18px] md:text-[34px] mt-7 md:mt-10">
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSf89xhYWkCM_9ILCV3RzB9YO94nZHZwHBg6EnIGUeyR7CBMiw/viewform"
            target="_blank"
            rel="noopener noreferrer"
          >
            사전 예약하러 가기
            <img
              src="/assets/right-arrow.svg"
              className="inline ml-2 md:ml-4 h-4 md:h-8"
            />
          </a>
        </button>
      </section>
      <div className="font-mobile-body5 text-mobile-body5 md:font-web-body1 md:text-web-body1 text-gray-4 flex justify-center py-20 md:py-36">
        Be Root, Be Connected, Treehouse
      </div>
      {/* Floating Button */}
      <div className="fixed left-1/2 transform -translate-x-1/2 w-11/12 bottom-5 md:bottom-10 z-50 cursor-pointer">
        <button className="rounded-xl bg-tree_green w-full px-6 h-14 md:h-16 text-gray-white text-mobile-body3 md:text-web-body1 drop-shadow-xl">
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSf89xhYWkCM_9ILCV3RzB9YO94nZHZwHBg6EnIGUeyR7CBMiw/viewform"
            target="_blank"
            rel="noopener noreferrer"
          >
            Treehouse 사전 예약하러 가기
          </a>
        </button>
      </div>
    </div>
  );
}
