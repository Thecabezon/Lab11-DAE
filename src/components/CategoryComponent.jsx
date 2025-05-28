import React from 'react';
import { useNavigate } from "react-router-dom";

function CategoryComponent(props) {
    const navigate = useNavigate();

    const gotoUrl = (codigo) => {
        navigate("/categories/edit/" + codigo);
    };

    return (
        <div className="card h-100 d-flex flex-column">
            {/* Imagen de portada */}
            {props.imagen && (
                <img 
                    src={props.imagen} 
                    alt={props.nombre} 
                    className="card-img-top" 
                    style={{ height: '200px', objectFit: 'cover' }}
                />
            )}

            {/* Contenido de la tarjeta */}
            <div className="card-body d-flex flex-column flex-grow-1">
                <h5 className="card-title">{props.nombre}</h5>
                
                {/* Descripción truncada */}
                <p 
                    className="card-text" 
                    style={{ 
                        flexGrow: 1, 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        display: '-webkit-box',
                        WebkitLineClamp: 3, // Cambia este número para mostrar más o menos líneas
                        WebkitBoxOrient: 'vertical',
                        minHeight: '60px'  // Altura mínima para mantener el tamaño visual
                    }}
                >
                    {props.descripcion}
                </p>

                {/* Botones fijos al fondo */}
                <div className="mt-auto d-flex justify-content-between">
                    <button 
                        onClick={() => gotoUrl(props.codigo)} 
                        className="btn btn-secondary"
                    >
                        Editar
                    </button>
                    <button 
                        onClick={props.onDelete} 
                        className="btn btn-danger"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CategoryComponent;
