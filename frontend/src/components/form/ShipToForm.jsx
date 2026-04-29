import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shipToSchema } from "../../validations/order.validation";
import { toast } from "sonner";
import { updateShippingAddress } from "../../services/order.api";
import { Loader2 } from "lucide-react";

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500";

const GOOGLE_MAPS_SCRIPT_ID = "google-maps-places-script";

const buildGoogleAddressString = (values = {}) =>
  [
    values.shippingAddress1,
    values.shippingAddress2,
    values.shippingCity,
    values.shippingState,
    values.shippingPostcode,
    values.shippingCountry,
  ]
    .filter((part) => part && String(part).trim())
    .join(", ");

const loadGoogleMapsPlaces = () => {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.maps?.places) return Promise.resolve();
  if (window.__googleMapsPlacesPromise) return window.__googleMapsPlacesPromise;

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey)
    return Promise.reject(new Error("Google Maps API key not found"));

  window.__googleMapsPlacesPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(GOOGLE_MAPS_SCRIPT_ID);

    if (existingScript) {
      existingScript.addEventListener("load", resolve, { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Failed to load Google Maps script")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = () =>
      reject(new Error("Failed to load Google Maps script"));
    document.head.appendChild(script);
  });

  return window.__googleMapsPlacesPromise;
};

const pickAddressComponent = (components, type, fallbackType) => {
  const found = components.find((component) => component.types?.includes(type));
  if (found) return found;
  if (!fallbackType) return undefined;
  return components.find((component) =>
    component.types?.includes(fallbackType),
  );
};

const getShippingValuesFromPlace = (place) => {
  const components = place?.address_components || [];
  const streetNumber =
    pickAddressComponent(components, "street_number")?.long_name || "";
  const route = pickAddressComponent(components, "route")?.long_name || "";
  const subpremise = pickAddressComponent(components, "subpremise")?.long_name;
  const city =
    pickAddressComponent(components, "locality", "postal_town")?.long_name ||
    "";
  const state =
    pickAddressComponent(components, "administrative_area_level_1")
      ?.long_name || "";
  const postcode =
    pickAddressComponent(components, "postal_code")?.long_name || "";
  const country = pickAddressComponent(components, "country")?.long_name || "";

  return {
    shippingAddress1: [streetNumber, route].filter(Boolean).join(" ").trim(),
    shippingAddress2: subpremise ? `Unit ${subpremise}` : "",
    shippingCity: city,
    shippingState: state,
    shippingPostcode: postcode,
    shippingCountry: country || "Australia",
    googleSearchAddress: place?.formatted_address || "",
  };
};

const normalizeCountry = (value) => {
  if (!value) return "Australia";
  const v = String(value).trim().toLowerCase();
  if (v === "au" || v === "australia") return "Australia";
  if (v === "us" || v === "usa" || v === "united states")
    return "United States";
  if (v === "uk" || v === "gb" || v === "united kingdom")
    return "United Kingdom";
  if (v === "in" || v === "india") return "India";
  return value;
};

const ShipToForm = ({ order, onSuccess, submitLabel = "Save" }) => {
  const [loading, setLoading] = useState(false);
  const googleInputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const placeListenerRef = useRef(null);
  const selectingFromGoogleRef = useRef(false);

  const googleSearchAddress = buildGoogleAddressString(order);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(shipToSchema),
    shouldFocusError: false,
    defaultValues: order
      ? {
          shippingFirstName: order?.shippingFirstName || "",
          shippingLastName: order?.shippingLastName || "",
          shippingCompany: order?.shippingCompany || "",
          shippingPhone: order?.shippingPhone || "",
          googleSearchAddress: googleSearchAddress || "",
          shippingAddress1: order?.shippingAddress1 || "",
          shippingAddress2: order?.shippingAddress2 || "",
          shippingCity: order?.shippingCity || "",
          shippingState: order?.shippingState || "",
          shippingPostcode: order?.shippingPostcode || "",
          shippingCountry: normalizeCountry(order?.shippingCountry),
        }
      : {},
  });

  useEffect(() => {
    if (!order) return;
    reset({
      shippingFirstName: order?.shippingFirstName || "",
      shippingLastName: order?.shippingLastName || "",
      shippingCompany: order?.shippingCompany || "",
      shippingPhone: order?.shippingPhone || "",
      googleSearchAddress: buildGoogleAddressString(order),
      shippingAddress1: order?.shippingAddress1 || "",
      shippingAddress2: order?.shippingAddress2 || "",
      shippingCity: order?.shippingCity || "",
      shippingState: order?.shippingState || "",
      shippingPostcode: order?.shippingPostcode || "",
      shippingCountry: normalizeCountry(order?.shippingCountry),
    });
  }, [order, reset]);

  const [
    shippingAddress1,
    shippingAddress2,
    shippingCity,
    shippingState,
    shippingPostcode,
    shippingCountry,
  ] = watch([
    "shippingAddress1",
    "shippingAddress2",
    "shippingCity",
    "shippingState",
    "shippingPostcode",
    "shippingCountry",
  ]);

  useEffect(() => {
    if (selectingFromGoogleRef.current) return;

    const combinedAddress = buildGoogleAddressString({
      shippingAddress1,
      shippingAddress2,
      shippingCity,
      shippingState,
      shippingPostcode,
      shippingCountry,
    });

    setValue("googleSearchAddress", combinedAddress, {
      shouldDirty: false,
      shouldValidate: false,
    });
  }, [
    setValue,
    shippingAddress1,
    shippingAddress2,
    shippingCity,
    shippingState,
    shippingPostcode,
    shippingCountry,
  ]);

  useEffect(() => {
    let isMounted = true;

    const setupAutocomplete = async () => {
      try {
        await loadGoogleMapsPlaces();
        if (!isMounted || !googleInputRef.current || autocompleteRef.current) {
          return;
        }

        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          googleInputRef.current,
          {
            types: ["address"],
            componentRestrictions: { country: "au" },
            fields: ["formatted_address", "address_components"],
          },
        );

        placeListenerRef.current = autocompleteRef.current.addListener(
          "place_changed",
          () => {
            const place = autocompleteRef.current?.getPlace();
            if (!place?.address_components?.length) return;

            selectingFromGoogleRef.current = true;
            const mappedValues = getShippingValuesFromPlace(place);

            Object.entries(mappedValues).forEach(([field, value]) => {
              setValue(field, value, {
                shouldDirty: true,
                shouldValidate: true,
              });
            });

            selectingFromGoogleRef.current = false;
          },
        );
      } catch {
        toast.error("Unable to load Google address lookup");
      }
    };

    setupAutocomplete();

    return () => {
      isMounted = false;
      if (placeListenerRef.current) {
        window.google?.maps?.event?.removeListener(placeListenerRef.current);
      }
    };
  }, [setValue]);

  const submitHandler = async (values) => {
    if (!order?.id) return;

    try {
      setLoading(true);
      const { googleSearchAddress: _googleSearchAddress, ...payload } = values;
      const response = await updateShippingAddress(order.id, payload);
      toast.success(
        response?.data?.message || "Shipping address updated successfully",
      );
      onSuccess?.();
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to update shipping address";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const googleSearchAddressRegister = register("googleSearchAddress");

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm text-gray-700">
            First name <span className="text-red-500">*</span>
          </label>
          <input {...register("shippingFirstName")} className={inputClass} />
          {errors.shippingFirstName && (
            <p className="mt-1 text-xs text-red-500">
              {errors.shippingFirstName.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-700">Last Name</label>
          <input {...register("shippingLastName")} className={inputClass} />
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-700">
            Company Name
          </label>
          <input {...register("shippingCompany")} className={inputClass} />
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-700">Phone</label>
          <input {...register("shippingPhone")} className={inputClass} />
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-700">
            Google Search Address <span className="text-red-500">*</span>
          </label>
          <input
            {...googleSearchAddressRegister}
            ref={(element) => {
              googleSearchAddressRegister.ref(element);
              googleInputRef.current = element;
            }}
            className={inputClass}
            autoComplete="off"
            placeholder="Search Australian address"
          />
          {errors.googleSearchAddress && (
            <p className="mt-1 text-xs text-red-500">
              {errors.googleSearchAddress.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-700">
            Address line 1 <span className="text-red-500">*</span>
          </label>
          <input {...register("shippingAddress1")} className={inputClass} />
          {errors.shippingAddress1 && (
            <p className="mt-1 text-xs text-red-500">
              {errors.shippingAddress1.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-700">
            Address line 2
          </label>
          <input {...register("shippingAddress2")} className={inputClass} />
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-700">
            Suburb <span className="text-red-500">*</span>
          </label>
          <input {...register("shippingCity")} className={inputClass} />
          {errors.shippingCity && (
            <p className="mt-1 text-xs text-red-500">
              {errors.shippingCity.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-700">
            State <span className="text-red-500">*</span>
          </label>
          <input {...register("shippingState")} className={inputClass} />
          {errors.shippingState && (
            <p className="mt-1 text-xs text-red-500">
              {errors.shippingState.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-700">
            Postcode <span className="text-red-500">*</span>
          </label>
          <input {...register("shippingPostcode")} className={inputClass} />
          {errors.shippingPostcode && (
            <p className="mt-1 text-xs text-red-500">
              {errors.shippingPostcode.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-700">
            Country/Region <span className="text-red-500">*</span>{" "}
          </label>
          <select {...register("shippingCountry")} className={inputClass}>
            <option value="Australia">Australia</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="India">India</option>
          </select>
          {errors.shippingCountry && (
            <p className="mt-1 text-xs text-red-500">
              {errors.shippingCountry.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default ShipToForm;
