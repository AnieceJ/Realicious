"use client";
import Container from "../_components/container";
import Left from "./_components/left";

export default function Account() {
  return (
    <Container className="bg-white flex-col sm:flex-row overflow-hidden">
      <Left></Left>
      <div className="w-[70%] h-180 p-4 flex-col justify-center items-center">
        <div className="w-full h-125 overflow-y-auto border flex flex-col">
          <div className="w-150 bg-gray-100 flex my-4">
            <div className=" w-12.5 border mx-4"></div>
            <div>
              <p>XXX</p>
              <p>今天天氣真好</p>
            </div>
          </div>
          <div className="w-150 bg-gray-100 flex flex-row-reverse my-4">
            <div className="w-12.5 border mx-4 "></div>
            <div className="">
              <p>XXX</p>
              <p>今天天氣真好</p>
            </div>
          </div>
        </div>
        <div className="w-full h-50 border">
          <input className="w-50 h-12.5 border" type="text" />
          <button className="w-25 h-12.5 border">送出</button>
        </div>
      </div>
    </Container>
  );
}
