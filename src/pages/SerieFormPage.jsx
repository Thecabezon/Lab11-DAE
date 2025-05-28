import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function SerieFormPage() {
    const initialSerieData = {
        title: '',
        description: '',
        release_date: '',
        rating: '',
        category: '',
        image_url: ''
    };

    const [data, setData] = useState(initialSerieData);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    // Cargar categorías
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/categories/')
            .then(response => setCategories(response.data))
            .catch(() => setError('No se pudieron cargar las categorías.'));
    }, []);

    // Si es edición, cargar los datos de la serie
    useEffect(() => {
        if (isEditMode) {
            setLoading(true);
            axios.get(`http://127.0.0.1:8000/api/series/${id}/`)
                .then(response => {
                    const serie = response.data;
                    setData({
                        title: serie.title,
                        description: serie.description || '',
                        release_date: serie.release_date,
                        rating: serie.rating,
                        category: typeof serie.category === 'object' ? serie.category.id : serie.category,
                        image_url: serie.image_url || ''
                    });
                    setLoading(false);
                })
                .catch(() => {
                    setError('No se pudo cargar la serie.');
                    setLoading(false);
                });
        }
    }, [id, isEditMode]);

    // Handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const payload = {
            ...data,
            rating: data.rating === '' ? null : parseFloat(data.rating)
        };

        const request = isEditMode
            ? axios.put(`http://127.0.0.1:8000/api/series/${id}/`, payload)
            : axios.post('http://127.0.0.1:8000/api/series/', payload);

        request
            .then(() => {
                setLoading(false);
                navigate('/series');
                if (!isEditMode) setData(initialSerieData);
            })
            .catch((err) => {
                console.error("Error:", err.response?.data || err.message);
                setError(`Hubo un problema al ${isEditMode ? 'actualizar' : 'crear'} la serie.`);
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
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Título</label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            className="form-control"
                            value={data.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Descripción</label>
                        <textarea
                            name="description"
                            id="description"
                            className="form-control"
                            value={data.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="release_date" className="form-label">Fecha de estreno</label>
                        <input
                            type="date"
                            name="release_date"
                            id="release_date"
                            className="form-control"
                            value={data.release_date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="rating" className="form-label">Rating</label>
                        <input
                            type="number"
                            name="rating"
                            id="rating"
                            className="form-control"
                            value={data.rating}
                            onChange={handleChange}
                            min="0"
                            max="10"
                            step="0.1"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="category" className="form-label">Categoría</label>
                        <select
                            name="category"
                            id="category"
                            className="form-select"
                            value={data.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecciona una categoría</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="image_url" className="form-label">URL de imagen</label>
                        <input
                            type="url"
                            name="image_url"
                            id="image_url"
                            className="form-control"
                            value={data.image_url}
                            onChange={handleChange}
                        />
                    </div>

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
                            {isEditMode ? 'Actualizar' : 'Crear'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default SerieFormPage;
