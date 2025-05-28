import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CategoryComponent from '../components/CategoryComponent';

function CategoryPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const navigate = useNavigate();
    
    useEffect(() => {
        // Cargar categorías al montar el componente
        fetchCategories();
    }, []);
    
    const fetchCategories = () => {
        setLoading(true);
        axios.get('http://127.0.0.1:8000/api/categories/')
            .then(response => {
                setCategories(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al obtener categorías:', error);
                setError('No se pudieron cargar las categorías. Por favor, intenta de nuevo.');
                setLoading(false);
            });
    };
    
    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
            axios.delete(`http://127.0.0.1:8000/api/categories/${id}/`)
                .then(() => {
                    // Actualizar la lista de categorías
                    fetchCategories();
                })
                .catch(error => {
                    console.error('Error al eliminar categoría:', error);
                    setError('No se pudo eliminar la categoría. Por favor, intenta de nuevo.');
                });
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Categorías</h1>
                <button 
                    className="btn btn-primary"
                    onClick={() => navigate('/categories/new')}
                >
                    Nueva Categoría
                </button>
            </div>
            
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
            
            {loading ? (
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            ) : (
                <div className="row">
                    {categories.length === 0 ? (
                        <div className="col-12">
                            <div className="alert alert-info">
                                No hay categorías disponibles. ¡Crea una nueva!
                            </div>
                        </div>
                    ) : (
                        categories.map(category => (
                            <div className="col-md-4 mb-3" key={category.id}>
                                <CategoryComponent 
                                    codigo={category.id}
                                    nombre={category.name}
                                    descripcion={category.description}
                                    onDelete={() => handleDelete(category.id)}
                                />
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default CategoryPage;