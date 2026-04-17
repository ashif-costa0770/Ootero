import { useState } from "react";
import FormField from "../common/FormField";
import Recaptcha from "../register/Recaptcha";
import RegisterButton from "../register/RegisterButton";
import LegalText from "../register/LegalText";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../validations/auth.validation";
import { useNavigate } from "react-router-dom";
import { register as registerApi } from "../../services/auth.api";


const RegisterForm = () => {
    const [loading, setLoading] = useState(false);
    const [captchaValue, setCaptchaValue] = useState("");
    const navigate = useNavigate();
    
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
      } = useForm({
        resolver: zodResolver(registerSchema),
        // shouldFocusError: false,
        defaultValues: {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
          country: "United State",
          company: "",
          shipmentRange: "I only need to ship one package"
        },
      });
  
    const handleRegister = async (data) => {
        if (!captchaValue) {
          toast.error("Please verify the captcha");
          return;
        }
        try {
          setLoading(true);
          const response = await registerApi({ ...data, captchaToken: captchaValue });
          if (response.status === 201) {
            toast.success("Registration successful. Please check your email for verification");
            navigate("/login");
            reset();
          }
        } catch (error) {
          const message =
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            "Failed to register";
          toast.error(message);
        } finally {
          setLoading(false);
        }
      };
  
    return (
      <form onSubmit={handleSubmit(handleRegister)} className="w-full">
        <div className="grid grid-cols-2 gap-x-4 gap-y-5 mb-6 mt-8">
          <FormField label="First Name" name="firstName" register={register} error={errors.firstName?.message} required placeholder="enter first name" />
          <FormField label="Last Name" name="lastName" register={register} error={errors.lastName?.message} required placeholder="enter last name" />
          
          <FormField label="Email Address" name="email" register={register} error={errors.email?.message} type="email" required placeholder="enter email address" />
          <FormField label="Phone" name="phone" register={register} error={errors.phone?.message} placeholder="enter phone number" />
          
          <FormField label="Password" name="password" register={register} error={errors.password?.message} type="password" required placeholder="enter password" />
          <FormField label="Repeat Password" name="confirmPassword" register={register} error={errors.confirmPassword?.message} type="password" required placeholder="enter repeat password" />
          
          <FormField 
            label="Country" 
            name="country" 
            register={register}
            error={errors.country?.message}
            type="select" 
            options={['United State', 'Canada', 'United Kingdom', 'Australia']} 
          />
          <FormField label="Company" name="company" register={register} error={errors.company?.message} placeholder="enter company name" />
          
          <FormField 
            label="Select your current number of shipments per month" 
            name="shipmentRange" 
            register={register}
            error={errors.shipmentRange?.message}
            type="select" 
            colSpan={true}
            options={['I only need to ship one package', '2 - 50 packages', '51 - 200 packages', '200+ packages']} 
          />
        </div>
  
        <Recaptcha onCaptchaChange={setCaptchaValue} />
        <RegisterButton loading={loading} />
        <LegalText />
      </form>
    );
  };

export default RegisterForm;