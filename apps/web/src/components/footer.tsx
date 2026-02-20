import { useRouter } from "next/navigation";
import Link from "next/link";

export const Footer = () => {
    const router = useRouter();

    return (
        <div className="bg-gradient-to-r from-[#0E897F] to-[#09786F] font-poppins text-white py-6 text-center">
            <p className="text-sm">&copy; {new Date().getFullYear()} VVV. All rights reserved.</p>
            <div className="mt-2">
                {/* <Button
                    onClick={() => router.push("/terms-of-service")}
                    variant="link" 
                    className="hover:cursor-pointer text-white"
                >
                    Terms of Service
                </Button> */}
                <Link href="/terms-of-service" className="hover:cursor-pointer text-white">
                    Terms of Service
                </Link>
            </div>
            <div className="mt-2">
                {/* <Button
                    onClick={() => router.push("/privacy-policy")}
                    variant="link" 
                    className="hover:cursor-pointer text-white"
                >
                    Privacy Policy
                </Button> */}
                <Link href="/privacy-policy" className="hover:cursor-pointer text-white">
                    Privacy Policy
                </Link>
            </div>
        </div>
    )
}