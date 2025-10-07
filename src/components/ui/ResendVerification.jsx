// components/ResendVerification.jsx
import { Button } from "@/components/ui/button"
import { useState } from "react"
import axios from "axios"

export function ResendVerification({ email }) {
const [isResending, setIsResending] = useState(false)
const [resendSuccess, setResendSuccess] = useState("")
const [resendError, setResendError] = useState("")
const [resendCount, setResendCount] = useState(0)
const [lastResendTime, setLastResendTime] = useState(null)

const handleResend = async () => {
if (!email) {
    setResendError("البريد الإلكتروني مطلوب")
    return
}

// Cooldown check (1 minute)
const now = new Date().getTime()
if (lastResendTime && now - lastResendTime < 60000) {
    const remaining = Math.ceil((60000 - (now - lastResendTime)) / 1000)
    setResendError(`انتظر ${remaining} ثانية`)
    return
}

// Max attempts check
if (resendCount >= 3) {
    setResendError("تجاوزت الحد الأقصى للمحاولات")
    return
}

setIsResending(true)
setResendError("")

try {
    await axios.post("http://127.0.0.1:8000/api/resend-verification/", {
    email: email.trim().toLowerCase()
    }, {
    headers: { "Content-Type": "application/json" },
    timeout: 30000
    })

    setResendSuccess("تم إعادة الإرسال بنجاح!")
    setResendCount(c => c + 1)
    setLastResendTime(new Date().getTime())
    
    setTimeout(() => setResendSuccess(""), 5000)
} catch (error) {
    setResendError(error.response?.data?.message || "حدث خطأ أثناء الإرسال")
} finally {
    setIsResending(false)
}
}

return (
<div className="mt-6 space-y-3">
    <p className="text-sm text-gray-600">لم تستلم الرسالة؟</p>
    
    <Button
    onClick={handleResend}
    disabled={isResending || resendCount >= 3}
    className="w-full"
    variant="outline"
    >
    {isResending ? "جاري الإرسال..." : "إعادة إرسال رابط التحقق"}
    </Button>

    {resendCount > 0 && (
    <p className="text-xs text-gray-500">المحاولة {resendCount} من 3</p>
    )}

    {resendSuccess && (
    <p className="text-sm text-green-600">{resendSuccess}</p>
    )}

    {resendError && (
    <p className="text-sm text-red-600">{resendError}</p>
    )}
</div>
)
}