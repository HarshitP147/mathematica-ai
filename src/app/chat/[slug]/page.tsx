import type { Metadata } from "next";

import { PromptInput } from "@/components/layout/prompt-input";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const metadata: Metadata = {
};

// generate 100 fake chat links with random scientific and computer related long names
const fakeChatLinksToIds = [
    { id: "chat-1", name: "Quantum Entanglement and Superposition Principles" },
    { id: "chat-2", name: "Neural Networks and Deep Learning Architectures" },
    { id: "chat-3", name: "Genetic Algorithms for Optimization Problems" },
    { id: "chat-4", name: "Particle Physics and Standard Model Theory" },
    { id: "chat-5", name: "Astrophysics and Cosmological Constants" },
    { id: "chat-6", name: "Molecular Biology and Gene Expression" },
    { id: "chat-7", name: "Cryptography and Public Key Infrastructure" },
    { id: "chat-8", name: "Machine Learning Model Training Strategies" },
    { id: "chat-9", name: "Data Structures and Algorithm Complexity" },
    { id: "chat-10", name: "Operating Systems and Process Scheduling" },
    { id: "chat-11", name: "Software Engineering Best Practices" },
    { id: "chat-12", name: "Blockchain Technology and Distributed Ledgers" },
    { id: "chat-13", name: "Artificial Intelligence and Cognitive Computing" },
    { id: "chat-14", name: "Cloud Computing Infrastructure Management" },
    { id: "chat-15", name: "Quantum Computing and Qubit Manipulation" },
    { id: "chat-16", name: "Deep Learning Convolutional Networks" },
    { id: "chat-17", name: "Computer Vision and Image Recognition" },
    { id: "chat-18", name: "Natural Language Processing Transformers" },
    { id: "chat-19", name: "Bioinformatics and Genomic Sequencing" },
    { id: "chat-20", name: "Nanotechnology and Molecular Engineering" },
    { id: "chat-21", name: "Cyber Security Threat Detection Systems" },
    { id: "chat-22", name: "Robotics and Autonomous Navigation" },
    { id: "chat-23", name: "Algorithms for Graph Theory Applications" },
    { id: "chat-24", name: "Database Systems and Query Optimization" },
    { id: "chat-25", name: "Network Protocols and TCP/IP Architecture" },
    { id: "chat-26", name: "Distributed Systems and Consensus Algorithms" },
    { id: "chat-27", name: "Cosmology and Dark Energy Theories" },
    { id: "chat-28", name: "Thermodynamics and Statistical Mechanics" },
    { id: "chat-29", name: "Fluid Dynamics and Navier-Stokes Equations" },
    { id: "chat-30", name: "Quantum Mechanics Wave Function Analysis" },
    { id: "chat-31", name: "Relativity Theory and Spacetime Geometry" },
    { id: "chat-32", name: "String Theory and Extra Dimensions" },
    { id: "chat-33", name: "Black Holes and Event Horizon Physics" },
    { id: "chat-34", name: "Dark Matter Detection Experiments" },
    { id: "chat-35", name: "Supernova Events and Stellar Evolution" },
    { id: "chat-36", name: "Exoplanet Studies and Habitability Zones" },
    { id: "chat-37", name: "Neuroscience and Brain Connectivity Mapping" },
    { id: "chat-38", name: "Genomics and DNA Sequencing Technologies" },
    { id: "chat-39", name: "Protein Folding and Structural Prediction" },
    { id: "chat-40", name: "CRISPR Technology and Gene Editing" },
    { id: "chat-41", name: "Quantum Cryptography and Secure Communications" },
    { id: "chat-42", name: "GPU Computing and Parallel Processing" },
    { id: "chat-43", name: "Tensor Networks and Quantum Simulations" },
    { id: "chat-44", name: "Reinforcement Learning Policy Optimization" },
    { id: "chat-45", name: "Neural Plasticity and Synaptic Formation" },
    { id: "chat-46", name: "Photonics and Optical Computing Systems" },
    { id: "chat-47", name: "Semiconductor Physics and Transistor Design" },
    { id: "chat-48", name: "Plasma Physics and Fusion Energy Research" },
    { id: "chat-49", name: "Geophysics and Seismic Wave Propagation" },
    { id: "chat-50", name: "Atmospheric Science and Climate Modeling" },
    { id: "chat-51", name: "Climate Modeling and Weather Prediction Systems" },
    { id: "chat-52", name: "Seismic Analysis and Earthquake Prediction" },
    { id: "chat-53", name: "Oceanography and Marine Ecosystem Dynamics" },
    { id: "chat-54", name: "Ecology Systems and Biodiversity Conservation" },
    { id: "chat-55", name: "Evolution Theory and Natural Selection" },
    { id: "chat-56", name: "Paleontology and Fossil Record Analysis" },
    { id: "chat-57", name: "Microbiology and Bacterial Resistance Mechanisms" },
    { id: "chat-58", name: "Immunology and Adaptive Immune Responses" },
    { id: "chat-59", name: "Virology and Viral Replication Strategies" },
    { id: "chat-60", name: "Pharmacology and Drug Interaction Studies" },
    { id: "chat-61", name: "Synthetic Biology and Metabolic Engineering" },
    { id: "chat-62", name: "Biomedical Engineering and Prosthetic Design" },
    { id: "chat-63", name: "Medical Imaging and Diagnostic Techniques" },
    { id: "chat-64", name: "Epidemiology and Disease Outbreak Modeling" },
    { id: "chat-65", name: "Oncology Research and Cancer Immunotherapy" },
    { id: "chat-66", name: "Neurotransmitters and Synaptic Signaling" },
    { id: "chat-67", name: "Endocrinology and Hormonal Regulation" },
    { id: "chat-68", name: "Cardiology Data Analysis and Heart Disease" },
    { id: "chat-69", name: "Pulmonary Science and Respiratory Mechanics" },
    { id: "chat-70", name: "Gastroenterology and Digestive System Health" },
    { id: "chat-71", name: "Nephrology Studies and Kidney Function" },
    { id: "chat-72", name: "Dermatology and Skin Cancer Detection" },
    { id: "chat-73", name: "Orthopedics and Bone Regeneration Therapy" },
    { id: "chat-74", name: "Psychiatry and Mental Health Treatments" },
    { id: "chat-75", name: "Psychology Insights and Cognitive Behavioral Therapy" },
    { id: "chat-76", name: "Sociology Trends and Social Network Analysis" },
    { id: "chat-77", name: "Anthropology and Human Cultural Evolution" },
    { id: "chat-78", name: "Archaeology and Ancient Civilization Studies" },
    { id: "chat-79", name: "Linguistics and Language Acquisition Theory" },
    { id: "chat-80", name: "Cryptanalysis and Breaking Encryption Schemes" },
    { id: "chat-81", name: "Information Theory and Shannon Entropy" },
    { id: "chat-82", name: "Coding Theory and Error Correction Codes" },
    { id: "chat-83", name: "Signal Processing and Fourier Transforms" },
    { id: "chat-84", name: "Image Processing and Feature Extraction" },
    { id: "chat-85", name: "Pattern Recognition and Classification Methods" },
    { id: "chat-86", name: "Optimization Theory and Convex Programming" },
    { id: "chat-87", name: "Graph Theory and Network Flow Problems" },
    { id: "chat-88", name: "Category Theory and Abstract Mathematics" },
    { id: "chat-89", name: "Abstract Algebra and Group Theory" },
    { id: "chat-90", name: "Real Analysis and Measure Theory" },
    { id: "chat-91", name: "Complex Numbers and Analytic Functions" },
    { id: "chat-92", name: "Topology and Manifold Theory" },
    { id: "chat-93", name: "Geometry and Differential Equations" },
    { id: "chat-94", name: "Number Theory and Prime Number Distribution" },
    { id: "chat-95", name: "Combinatorics and Discrete Mathematics" },
    { id: "chat-96", name: "Probability Theory and Stochastic Processes" },
    { id: "chat-97", name: "Statistics and Hypothesis Testing Methods" },
    { id: "chat-98", name: "Bayesian Methods and Posterior Distributions" },
    { id: "chat-99", name: "Monte Carlo Simulations and Random Sampling" },
    { id: "chat-100", name: "Chaos Theory and Nonlinear Dynamics" },
];

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;

    // get the name from fakeChatLinksToIds based on the slug
    const chat = fakeChatLinksToIds.find(chat => chat.id === resolvedParams.slug);

    metadata.title = `${chat ? chat.name : resolvedParams.slug}`;

    return (
        <div className="min-h-screen min-w-full relative">
            <header className="border border-b  shadow-md  flex justify-around items-center-safe py-3  gap-x-3  ">
                <SidebarTrigger className=" ml-3 hover:cursor-pointer p-4 rounded-full" />
                <div className="flex-1  text-center ">
                    <h1 className="text-2xl font-bold ">{chat ? chat.name : resolvedParams.slug}</h1>
                </div>
            </header>
            {/* content area could render messages here */}
            <div id="chat-messages-container" className="h-full p-4 pb-40 overflow-auto text-sm text-muted-foreground">
                {fakeChatLinksToIds.map((chat) => (
                    <div key={chat.id} className="py-2">
                        <strong>{chat.name}</strong>
                    </div>
                ))}
            </div>

            <footer className="fixed bottom-0 left-0 right-0 px-4 py-4">
                <div className="max-w-4xl mx-auto">
                    <PromptInput />
                </div>
            </footer>
        </div>
    )
}