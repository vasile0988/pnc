import React, { useEffect, useState } from 'react';
import { fetchMessages } from '@/api/request'; // Assurez-vous que le chemin est correct
import { NotFoundIcon } from "@/components/icons";

export const Messages = ({ className }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);

    useEffect(() => {
        const loadMessages = async () => {
            const result = await fetchMessages();
            if (result.success) {
                setMessages(result.messages);
            } else {
                console.error("Erreur lors de la récupération des messages:", result.message);
            }
            setLoading(false);
        };

        loadMessages();
    }, []);

    const handleMessageClick = (message) => {
        setSelectedMessage(message);
    };

    const handleCloseModal = () => {
        setSelectedMessage(null);
    };

    if (loading) {
        return <div>Chargement...</div>; // Ajoutez un loader ou message approprié
    }

    return (
        <section className={`${className} pb-8`}>
            <div className="container mx-auto max-w-4xl py-8 px-4">
                <h1 className="text-2xl font-montserrat-bold mb-8 text-gray-800" data-aos="fade-up">
                    Messages
                </h1>
                <div className="flex md:flex-row flex-col md:items-start md:justify-center gap-8 items-center justify-center" data-aos="fade-up">
                    {messages.length === 0 ? (
                        <div className="text-zinc-500 flex flex-col py-8 items-center">
                            <NotFoundIcon className="h-20 w-20" />
                            <span>Aucun message trouvé</span>
                        </div>
                    ) : (
                        <ul className="w-full bg-white rounded-2xl shadow-xl shadow-zinc-300 p-4 flex flex-col gap-4">
                            {messages.map((message, index) => (
                                <li key={message.cont_id} className="list-none flex flex-row gap-2 bg-theme3 rounded-xl p-2 w-full items-center justify-between">
                                    <span className="flex flex-row gap-4">
                                        <span className="text-gray-800 font-montserrat-bold">{index + 1}</span>
                                        <span>{message.cont_name} {message.cont_surname}</span>
                                    </span>
                                    <span>
                                        <button 
                                            onClick={() => handleMessageClick(message)}
                                            className="px-2 py-1 text-white bg-blue-500 hover:bg-blue-800 transition-colors duration-300 rounded-md"
                                        >
                                            Voir
                                        </button>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {selectedMessage && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-2xl relative text-sm p-4 w-11/12 md:w-1/3 transition duration-300">
                        <button onClick={handleCloseModal} className="absolute top-2 right-2 text-white duration-300 transition-colors rounded-xl p-2 bg-blue-500 hover:bg-blue-800">
                            Fermer
                        </button>
                        <h2 className="text-xl font-bold mb-4">Détails du message</h2>
                        <ul className="space-y-2">
                            <li className="flex justify-between items-center p-2 rounded-xl bg-theme3">
                                <span className="font-montserrat-bold">Nom</span>
                                <span className="text-zinc-500">{selectedMessage.cont_name} {selectedMessage.cont_surname}</span>
                            </li>
                            <li className="flex justify-between items-center p-2 rounded-xl bg-theme3">
                                <span className="font-montserrat-bold">Email</span>
                                <span className="text-zinc-500">{selectedMessage.cont_email}</span>
                            </li>
                            <li className="flex justify-between items-center p-2 rounded-xl bg-theme3">
                                <span className="font-montserrat-bold">Téléphone</span>
                                <span className="text-zinc-500">{selectedMessage.cont_tel}</span>
                            </li>
                            <li className="flex justify-between items-center p-2 rounded-xl bg-theme3">
                                <span className="font-montserrat-bold">Message</span>
                                <span className="text-zinc-500">{selectedMessage.cont_message}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </section>
    );
};

