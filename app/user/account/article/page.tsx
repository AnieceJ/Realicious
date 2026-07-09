"use client";
import Container from "../../_components/container";
import Left from "../_components/left";

export default function Account() {
  return (
    <Container className="bg-white flex-col sm:flex-row overflow-hidden">
      <Left></Left>
      <div className="w-[70%] h-180 p-4 overflow-y-auto">
      </div>
    </Container>
  );
}
