import Hero from "@/components/Global/providerprofile/Hero";
import Services from "@/components/Global/providerprofile/JacobServices";
import ClientFeedback from "@/components/Global/providerprofile/ClientFeedback";

export default function ProviderProfilePage() {
    return (
        <div>
            <Hero/>
            <Services/>
            <ClientFeedback/>
        </div>
    );
}