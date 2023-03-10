import { type NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

import { api, type RouterOutputs } from '~/utils/api';

import Header from '~/components/Header';
import NoteEditor from '~/components/NoteEditor';
import NoteCard from '~/components/displays/NoteCard';

const Home: NextPage = () => {
    return (
        <>
            <Head>
                <title>Notetaker</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="">
                <Header />
                <Content />
            </main>
        </>
    );
};

export default Home;

type Topic = RouterOutputs['topic']['getAll'][0];

const Content: React.FC = () => {
    const { data: sessionData } = useSession();

    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

    const { data: topics, refetch: refetchTopics } = api.topic.getAll.useQuery(
        undefined, // no input
        {
            enabled: sessionData?.user !== undefined,
            onSuccess: (data) => {
                setSelectedTopic(selectedTopic ?? data[0] ?? null);
            },
        }
    );

    const createTopic = api.topic.create.useMutation({
        onSuccess: () => {
            void refetchTopics();
        },
    });

    // map data output to notes, if we have a user & selected topic, run getAll()
    const { data: notes, refetch: refetchNotes } = api.note.getAll.useQuery(
        { topicId: selectedTopic?.id ?? '' },
        {
            enabled: sessionData?.user !== undefined && selectedTopic !== null,
        }
    );

    // refresh notes upon successful note creation
    const createNote = api.note.create.useMutation({
        onSuccess: () => {
            void refetchNotes();
        },
    });

    const deleteNote = api.note.delete.useMutation({
        onSuccess: () => {
            void refetchNotes();
        },
    });

    return (
        <div className="mx-5 mt-5 grid grid-cols-4 gap-2">
            {/* topics */}
            <div className="col-span-1 px-2">
                {/* List topics */}
                <ul className="menu rounded-box w-full bg-base-100 p-2 text-left">
                    {topics?.map((topic) => (
                        <li key={topic.id} className="">
                            <a
                                href="#"
                                onClick={(evt) => {
                                    evt.preventDefault();
                                    setSelectedTopic(topic);
                                }}
                            >
                                {topic.title}
                            </a>
                        </li>
                    ))}
                </ul>

                {/* Create topic input */}
                <input
                    type="text"
                    placeholder="New Topic"
                    className="input-bordered input input-sm mt-4 w-full"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            createTopic.mutate({
                                title: e.currentTarget.value,
                            });
                            e.currentTarget.value = '';
                        }
                    }}
                />
            </div>
            {/* Notes */}
            <div className="col-span-3 divide-y">
                {/* list of notes */}
                <div className="mb-10">
                    {notes?.map((note) => (
                        <div key={note.id} className="mt-5">
                            <NoteCard
                                note={note}
                                onDelete={() =>
                                    void deleteNote.mutate({ id: note.id })
                                }
                            />
                        </div>
                    ))}
                </div>
                <div className="mt-10">
                    {/* Note Editor */}
                    <NoteEditor
                        editable={true}
                        onSave={({ title, content }) => {
                            void createNote.mutate({
                                title,
                                content,
                                topicId: selectedTopic?.id ?? '',
                            });
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

// const AuthShowcase: React.FC = () => {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = api.example.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined }
//   );

//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="text-center text-2xl text-white">
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//         {secretMessage && <span> - {secretMessage}</span>}
//       </p>
//       <button
//         className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//         onClick={sessionData ? () => void signOut() : () => void signIn()}
//       >
//         {sessionData ? "Sign out" : "Sign in"}
//       </button>
//     </div>
//   );
// };
