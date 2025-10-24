import React, { useState } from "react";

interface PopupFormProps {
  isOpen: boolean;
  onClose: () => void;
  subcategory: string;
  onSubmit: (data: { fullname: string; emailaddress: string; phoneno: string; question: string; enquiry: string }) => void;
}

const PopupForm: React.FC<PopupFormProps> = ({ isOpen, onClose, subcategory, onSubmit }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [question, setQuestion] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-pink-600"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-lg font-bold mb-2 text-pink-700">Enquiry for: <span className="text-gray-800">{subcategory}</span></h2>
        <form className="space-y-4" onSubmit={e => {
          e.preventDefault();
          onSubmit({
            fullname: fullName,
            emailaddress: email,
            phoneno: phone,
            question: question,
            enquiry: subcategory
          });
        }}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Questions or Commands</label>
            <textarea
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              rows={4}
              value={question}
              onChange={e => setQuestion(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-2 rounded-md font-semibold hover:bg-pink-700 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default PopupForm;
