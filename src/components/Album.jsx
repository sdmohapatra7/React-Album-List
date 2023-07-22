import React, { useState, useEffect } from 'react';

export default function Album() {
    const [albums, setAlbums] = useState([]);
    const [newAlbumTitle, setNewAlbumTitle] = useState('');
    const [updateAlbumId, setUpdateAlbumId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [albumsPerPage] = useState(5);

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
            setNewAlbumTitle('');
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

    // Get current albums based on current page
    const indexOfLastAlbum = currentPage * albumsPerPage;
    const indexOfFirstAlbum = indexOfLastAlbum - albumsPerPage;
    const currentAlbums = albums.slice(indexOfFirstAlbum, indexOfLastAlbum);

    // Change page
    // const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Previous page
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Next page
    const handleNextPage = () => {
        if (currentPage < Math.ceil(albums.length / albumsPerPage)) {
            setCurrentPage(currentPage + 1);
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
                {currentAlbums.map(album => (
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
                                <>
                                    <button onClick={() => saveUpdatedAlbumTitle(album.id, newAlbumTitle)}>
                                        Save
                                    </button>
                                    <button onClick={() => setUpdateAlbumId(null)}>Cancel</button>
                                </>
                            ) : (
                                <button onClick={() => handleUpdateAlbum(album.id)}>Update</button>
                            )}
                            <button onClick={() => handleDeleteAlbum(album.id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
            {/* Pagination */}
            <div className="pagination">
                <button onClick={handlePrevPage} disabled={currentPage === 1}>
                    Previous
                </button>
                {/* {Array.from({ length: Math.ceil(albums.length / albumsPerPage) }).map((_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        disabled={currentPage === index + 1}
                    >
                        {index + 1}
                    </button>
                ))} */}
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === Math.ceil(albums.length / albumsPerPage)}
                >
                    Next
                </button>
            </div>
        </div>
    )
}
