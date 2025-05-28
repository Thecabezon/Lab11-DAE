import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function SerieFormPage() {
    const initialSerieData = {
        title: '',
        description: '',
        release_date: '', // Usaremos el mismo nombre que espera el backend
        rating: '',
        category: '',     // Este será el ID de la categoría
        image_url: ''
    };

    const [data, setData] = useState(initialSerieData);
    
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    // Cargar categorías para el select
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/categories/')
            .then(response => setCategories(response.data))
            .catch(() => setError('No se pudieron cargar las categorías.'));
    }, []);

    // Si es edición, cargar datos de la serie (ESTO SE AJUSTARÁ EN EL PASO 14 DEL LABORATORIO)
    useEffect(() => {
        if (isEditMode) {
            setLoading(true);
            axios.get(`http://127.0.0.1:8000/api/series/${id}/`)
                .then(response => {
                    const serie = response.data;
                    // Aquí es donde el paso 14 indicará cómo usar setData
                    // Por ahora, para que no rompa, lo dejamos así, pero no poblará el formulario en edición
                    // setData({
                    //     title: serie.title,
                    //     description: serie.description,
                    //     release_date: serie.release_date,
                    //     rating: serie.rating,
                    //     category: serie.category.id, // Asumiendo que category es un objeto con id
                    //     image_url: serie.image_url || ''
                    // });
                    setLoading(false);
                })
                .catch(() => {
                    setError('No se pudo cargar la serie.');
                    setLoading(false);
                });
        }
    }, [id, isEditMode]); // Agregué setData a las dependencias si se usa dentro

    // Funciones handleChange para cada campo del formulario
    const handleChangeTitle = (event) => {
        setData(prevData => ({
            ...prevData,
            title: event.target.value
        }));
    };

    const handleChangeDescription = (event) => {
        setData(prevData => ({
            ...prevData,
            description: event.target.value
        }));
    };

    const handleChangeReleaseDate = (event) => {
        setData(prevData => ({
            ...prevData,
            release_date: event.target.value
        }));
    };

    const handleChangeRating = (event) => {
        setData(prevData => ({
            ...prevData,
            rating: event.target.value
        }));
    };

    const handleChangeCategory = (event) => {
        setData(prevData => ({
            ...prevData,
            category: event.target.value 
        }));
    };

    const handleChangeImageUrl = (event) => {
        setData(prevData => ({
            ...prevData,
            image_url: event.target.value
        }));
    };

    // Función para manejar el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // El estado 'data' ya contiene todos los campos del formulario
        const payload = {
            ...data,
            // Asegurarse que los números sean números si el backend es estricto
            rating: data.rating === '' ? null : parseFloat(data.rating), // o parseInt si es entero
             // category podría necesitar ser parseInt(data.category) si es un número y no un string
        };


        const request = isEditMode
            ? axios.put(`http://127.0.0.1:8000/api/series/${id}/`, payload) 
            : axios.post('http://127.0.0.1:8000/api/series/', payload);   

        request
            .then(() => {
                setLoading(false);
                navigate('/series');
                if (!isEditMode) { // Opcional: Resetear formulario después de crear
                    setData(initialSerieData);
                }
            })
            .catch((axiosError) => {
                console.error("Error en la petición:", axiosError.response ? axiosError.response.data : axiosError.message);
                setError(`Hubo un problema al ${isEditMode ? 'actualizar' : 'crear'} la serie. Verifica los datos.`);
                setLoading(false);
            });
    };
    
    return (
        <div className="container mt-4">
            <h2>{isEditMode ? 'Editar Serie' : 'Nueva Serie'}</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {loading ? (
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    {/* Título */}
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Título</label>
                        <input
                            type="text"
                            id="title"
                            className="form-control"
                            value={data.title} 
                            onChange={handleChangeTitle} 
                            required
                        />
                    </div>
                    {/* Descripción */}
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Descripción</label>
                        <textarea
                            id="description"
                            className="form-control"
                            value={data.description}
                            onChange={handleChangeDescription}
                        />
                    </div>
                    {/* Fecha de estreno */}
                    <div className="mb-3">
                        <label htmlFor="release_date" className="form-label">Fecha de estreno</label>
                        <input
                            type="date"
                            id="release_date"
                            className="form-control"
                            value={data.release_date}
                            onChange={handleChangeReleaseDate}
                            required
                        />
                    </div>
                    {/* Rating */}
                    <div className="mb-3">
                        <label htmlFor="rating" className="form-label">Rating</label>
                        <input
                            type="number"
                            id="rating"
                            className="form-control"
                            value={data.rating}
                            onChange={handleChangeRating}
                            min="0"
                            max="10"
                            step="0.1"
                            required
                        />
                    </div>
                    {/* Categoría */}
                    <div className="mb-3">
                        <label htmlFor="category" className="form-label">Categoría</label>
                        <select
                            id="category"
                            className="form-select"
                            value={data.category} 
                            onChange={handleChangeCategory} 
                            required
                        >
                            <option value="">Selecciona una categoría</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    {/* URL de imagen */}
                    <div className="mb-3">
                        <label htmlFor="image_url" className="form-label">URL de imagen</label>
                        <input
                            type="url"
                            id="image_url"
                            className="form-control"
                            value={data.image_url}
                            onChange={handleChangeImageUrl}
                            // No tiene 'required' según tu código y el paso 11 pide quitarlo si lo tuviera
                        />
                    </div>
                    {/* Botones */}
                    <div className="d-flex justify-content-between">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate('/series')}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Crear')}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default SerieFormPage;