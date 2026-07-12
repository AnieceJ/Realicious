import Container from "../_components/container";

export default function ForgetPassword() {
  return (
    <Container>
      <div className="flex justify-center items-center sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="w-[430px] h-[720px] bg-white border flex flex-col items-center">
          <h1 className="text-[24px] my-[40px]">重置密碼</h1>
          <form className="flex flex-col items-center mb-[20px]">
            <div className="flex flex-col items-start mb-[20px]">
              <label className="text-[20px] mb-[10px]" htmlFor="password">
                密碼
              </label>
              <input
                className="border w-[350px] h-[50px] text-[16px] px-2"
                type="text"
                id="password"
                placeholder="請輸入密碼"
              />
            </div>
            <div className="flex flex-col items-start mb-[5px]">
              <label className="text-[20px] mb-[10px]" htmlFor="password">
                密碼確認
              </label>
              <input
                className="border w-[350px] h-[50px] text-[16px] px-2"
                type="text"
                id="password"
                placeholder="請再次輸入密碼"
              />
            </div>
            <div className="flex justify-between w-[350px] mb-[20px]">
              <p className="text-red-500">密碼不相同</p>
            </div>
            <button className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-[220px] h-[60px] bg-[#F02A2D] text-white text-[26px] cursor-pointer hover:bg-[#e50004] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              確認送出
            </button>
          </form>
        </div>
      </div>
    </Container>
  );
}
