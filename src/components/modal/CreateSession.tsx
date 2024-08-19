import { Button, Divider, message } from "antd";
import React, { FC, useState } from "react";
import { API } from "../../constant";
import { getToken } from "../../helpers";

interface CreateSessionProps {
  setShowModal: (show: boolean) => void;
}
const CreateSession: FC<CreateSessionProps> = ({ setShowModal }) => {
  const [sessionName, setSessionName] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleCreate = async () => {
    try {
      const value = {
        name: sessionName,
      };
      const token = getToken();
      if (token) {
        const response = await fetch(`${API}/sessions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token}`,
          },
          body: JSON.stringify(value),
        });

        const result = await response.json();
        if(result?.error) {
            setError(result.error?.message);
            throw result.error;
        }
        else {
            message.success(`Created Session: ${result.name}!`)
            setShowModal(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none px-4">
        <div className="relative w-auto min-w-full sm:min-w-[450px] my-6 mx-auto max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
              <h3 className="text-xl font-semibold">Create Session</h3>
            </div>
            <div className="relative p-6 flex-auto">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 "
              >
                Session Name
              </label>
              <input
                type="text"
                id="first_name"
                className="bg-gray-50 border border-gray-300  text-sm placeholder:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Name"
                required
                value={sessionName}
                onChange={(e) => {
                    setSessionName(e.target.value)
                    if(error) {
                        setError("");
                    }
                }}
              />
              {error && <div className="text-red-600 text-xs ">{error}</div>}
            </div>
            <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b gap-4">
              <button
                className=" hover:bg-neutral-100 background-transparent px-4 py-2 text-sm rounded"
                type="button"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <button
                disabled={!sessionName}
                className=" bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-4 py-2 rounded shadow hover:shadow-lg "
                onClick={handleCreate}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </div>
  );
};

export default CreateSession;
