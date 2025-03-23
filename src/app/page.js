import ImageSearch from "@/components/MainSection";
import AriaLogo from "/public/assets/logo.png";
import Image from "next/image";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 sm:p-14 lg:p-24">
      <div className="flex flex-col items-center justify-start gap-2">
        <Image src={AriaLogo} alt="Aria Logo" width={150} height={150} />

        <p>Over 5.4 million+ high quality stock images</p>
        <p>Powered By PixaBay</p>
      </div>
      <ImageSearch />
    </main>
  );
}
