import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function CategoryFormPage() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const { id } = useParams();  // Si hay id, es edición
    const navigate = useNavigate();
    const isEditMode = !!id;

    // Si es edición, carga los datos de la categoría
    useEffect(() => {
        if (isEditMode) {
            setLoading(true);
            axios.get(`http://127.0.0.1:8000/api/categories/${id}/`)
                .then(response => {
                    setName(response.data.name);
                    setDescription(response.data.description || '');
                    setLoading(false);
                })
                .catch(() => {
                    setError('No se pudo cargar la categoría.');
                    setLoading(false);
                });
        }
    }, [id, isEditMode]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const data = { name, description };

        const request = isEditMode
            ? axios.put(`http://127.0.0.1:8000/api/categories/${id}/`, data)
            : axios.post('http://127.0.0.1:8000/api/categories/', data);

        request
            .then(() => {
                setLoading(false);
                navigate('/categories');
            })
            .catch(() => {
                setError('Hubo un problema. Verifica los datos.');
                setLoading(false);
            });
    };

    return (
        <div className="container mt-4">
            <h2>{isEditMode ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
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
                        <label className="form-label">Nombre</label>
                        <input
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Descripción</label>
                        <textarea
                            className="form-control"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="d-flex justify-content-between">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate('/categories')}
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

export default CategoryFormPage;