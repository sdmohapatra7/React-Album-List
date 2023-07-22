import React, { useState, useEffect } from 'react';

export default function Album() {
    const [albums, setAlbums] = useState([]);
    const [newAlbumTitle, setNewAlbumTitle] = useState('');
    const [updateAlbumId, setUpdateAlbumId] = useState(null);

    useEffect(() => {
        fetchAlbums();
    }, []);

    const fetchAlbums = async () => {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/albums');
            if (!response.ok) {
                throw new Error('Failed to fetch albums');
            }
            const data = await response.json();
            setAlbums(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddAlbum = async () => {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/albums', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: newAlbumTitle,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add album');
            }

            const data = await response.json();
            setAlbums([...albums, data]);
            setNewAlbumTitle(''); // Clear the input field after adding an album
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateAlbum = async (albumId) => {
        try {
            setUpdateAlbumId(albumId);
        } catch (error) {
            console.error(error);
        }
    };

    const saveUpdatedAlbumTitle = async (albumId, updatedTitle) => {
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/albums/${albumId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: updatedTitle,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update album');
            }

            const updatedAlbums = albums.map(album =>
                album.id === albumId ? { ...album, title: updatedTitle } : album
            );
            setAlbums(updatedAlbums);
            setUpdateAlbumId(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteAlbum = async (albumId) => {
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/albums/${albumId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete album');
            }

            const updatedAlbums = albums.filter(album => album.id !== albumId);
            setAlbums(updatedAlbums);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <div>
                <input
                    type="text"
                    value={newAlbumTitle}
                    onChange={(e) => setNewAlbumTitle(e.target.value)}
                    placeholder="Enter album title"
                />
                <button onClick={handleAddAlbum}>Add Album</button>
            </div>
            <ul>
                {albums.map(album => (
                    <li key={album.id}>
                        {updateAlbumId === album.id ? (
                            <input
                                type="text"
                                value={newAlbumTitle}
                                onChange={(e) => setNewAlbumTitle(e.target.value)}
                            />
                        ) : (
                            album.title
                        )}
                        <div>
                            {updateAlbumId === album.id ? (
                                <button onClick={() => saveUpdatedAlbumTitle(album.id, newAlbumTitle)}>
                                    Save
                                </button>
                            ) : (
                                <button onClick={() => handleUpdateAlbum(album.id)}>Update</button>
                            )}
                            <button onClick={() => handleDeleteAlbum(album.id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
