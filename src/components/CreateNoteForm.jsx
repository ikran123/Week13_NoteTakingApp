// TODO: Import useForm, zodResolver, axios, useNavigate, useState, and noteSchema
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { noteSchema } from "../schema/notes";

import { Save } from "lucide-react";


const CreateNoteForm = () => {
  // TODO: Setup isSubmitting state with useState
  const [isSubmitting, setIsSubmitting] = useState(false);
  // TODO: create navigate variable and set to useNavigate()
  const navigate = useNavigate();


  // TODO: Set up the form with useForm from react-hook-form and zodResolver from @hookform/resolvers/zod
  const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: zodResolver(noteSchema),
});




  const sendToTheServer = async (data) => {
    // TODO: Send the data to the server
    // TODO: Use axios to create a new note in the server using the endpoint http://localhost:3001/api/notes
    try{
      setIsSubmitting(true);
      console.log('sending data to server:', data)
     await axios.post("http://localhost:3001/api/notes", data);
    alert("Note created successfully!");
    navigate("/")
    } catch (error){
      console.error("Error creating note", error.response?.data|| error.message);
      alert("Something went wrong. Please try again.");
    } finally{
      setIsSubmitting(false);
    }
    
    
  };

  return (
    <form onSubmit={handleSubmit(sendToTheServer)} className="bg-white p-8 rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-4">Create a New Note</h2>

      <div className="mb-4">
        <label className="block font-medium mb-1">Title</label>
        <input
          {...register("title")}
          type="text"
          className="w-full px-4 py-2 border rounded-md"
          placeholder="Note Title"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block font-medium mb-1">Content</label>
        <textarea
          {...register("content")}
          className="w-full px-4 py-2 border rounded-md"
          rows={6}
          placeholder="Write your note here..."
        />
        {errors.content && (
          <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-white py-2 rounded-md flex items-center justify-center gap-2"
      >
        <Save size={16} />
        {isSubmitting ? "Saving..." : "Save Note"}
      </button>
    </form>
  );
};

export default CreateNoteForm;

