import HomeUser from "@/components/common/home-user";
import Image from "next/image";

export default async function Home() {

  return (
    <div className='h-screen flex items-center flex-col justify-center'>
      <div className='p-10 rounded-md border justify-center items-center flex flex-col'>
        <h1 className="text-5xl font-bold mb-10 mt-3">Welcome to Dot Connect</h1>
        <Image src="/connections.png" height={100} width={100} alt="icon" />
        <HomeUser/>
      </div>
    </div>
  );
}
