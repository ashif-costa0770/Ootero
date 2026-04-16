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
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      repeatPassword: '',
      country: 'United State',
      company: '',
      shipments: 'I only need to ship one package'
    });
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
        defaultValues: {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
          repeatPassword: "",
          country: "United State",
          company: "",
          shipments: "I only need to ship one package"
        },
      });
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleRegister = async (data) => {
        if (!captchaValue) {
          toast.error("Please verify the captcha");
          return;
        }
        try {
          setLoading(true);
          const response = await registerApi({ ...data, captchaToken: captchaValue });
          if (response.status === 201) {
            toast.success("Registration successful");
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
          <FormField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="enter first name" />
          <FormField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="enter last name" />
          
          <FormField label="Email Address" name="email" value={formData.email} onChange={handleChange} type="email" required placeholder="enter email address" />
          <FormField label="Phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="enter phone number" />
          
          <FormField label="Password" name="password" value={formData.password} onChange={handleChange} type="password" required placeholder="enter password" />
          <FormField label="Repeat Password" name="repeatPassword" value={formData.repeatPassword} onChange={handleChange} type="password" required placeholder="enter repeat password" />
          
          <FormField 
            label="Country" 
            name="country" 
            value={formData.country} 
            onChange={handleChange} 
            type="select" 
            options={['United State', 'Canada', 'United Kingdom', 'Australia']} 
          />
          <FormField label="Company" name="company" value={formData.company} onChange={handleChange} placeholder="enter company name" />
          
          <FormField 
            label="Select your current number of shipments per month" 
            name="shipments" 
            value={formData.shipments} 
            onChange={handleChange} 
            type="select" 
            colSpan={true}
            options={['I only need to ship one package', '2 - 50 packages', '51 - 200 packages', '200+ packages']} 
          />
        </div>
  
        <Recaptcha />
        <RegisterButton />
        <LegalText />
      </form>
    );
  };

export default RegisterForm;