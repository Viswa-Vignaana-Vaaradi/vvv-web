import { useRouter } from "next/navigation"
import { Button } from "./ui/button"

export const Footer = () => {
    const router = useRouter();

    return (
        <div className="bg-gradient-to-r from-[#0E897F] to-[#09786F] font-poppins text-white py-6 text-center">
            <p className="text-sm">&copy; {new Date().getFullYear()} VVV. All rights reserved.</p>
            <div className="mt-2">
                <Button
                    onClick={() => router.push("/terms-of-service")}
                    variant="link" 
                    className="hover:cursor-pointer text-white"
                >
                    Terms of Service
                </Button>
            </div>
            <div className="mt-2">
                <Button
                    onClick={() => router.push("/privacy-policy")}
                    variant="link" 
                    className="hover:cursor-pointer text-white"
                >
                    Privacy Policy
                </Button>
            </div>
        </div>
    )
}