"use client";
import Container from "../_components/container";
import Link from "next/link";
import Left from "./_components/left";

export default function Account() {
  return (
    <Container className="bg-white flex-col sm:flex-row overflow-hidden">
      <Left></Left>
      <div className="w-[70%] h-[720px] p-4 flex-col justify-center items-center">
        <div className="w-full h-[500px] overflow-y-auto border flex flex-col">
          <div className="w-[600px] bg-gray-100 flex my-4">
            <div className=" w-[50px] w-[50px] border mx-4"></div>
            <div>
              <p>XXX</p>
              <p>今天天氣真好</p>
            </div>
          </div>
          <div className="w-[600px] bg-gray-100 flex flex-row-reverse my-4">
            <div className="w-[50px] w-[50px] border mx-4 "></div>
            <div className="">
              <p>XXX</p>
              <p>今天天氣真好</p>
            </div>
          </div>
        </div>
        <div className="w-full h-[200px] border">
          <input className="w-[200px] h-[50px] border" type="text" />
          <button className="w-[100px] h-[50px] border">送出</button>
        </div>
      </div>
    </Container>
  );
}
