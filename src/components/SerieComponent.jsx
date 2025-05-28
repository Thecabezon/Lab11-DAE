import React from 'react';
import { useNavigate } from "react-router-dom";

function SerieComponent(props) {
    const navigate = useNavigate();

    const gotoUrl = (codigo) => {
        navigate("/series/edit/" + codigo);
    }

    return (
        <div className="card h-100 d-flex flex-column" style={{ minHeight: '580px' }}>
            {/* Imagen estilo portada */}
            <img 
                src={props.imagen || "https://via.placeholder.com/300x200?text=Sin+Imagen"} 
                className="card-img-top"
                alt={props.titulo}
                style={{ 
                    height: '520px',         // Imagen más alta
                    width: '100%', 
                    objectFit: 'cover',
                    borderTopLeftRadius: '0.375rem',
                    borderTopRightRadius: '0.375rem'
                }}
            />
            
            {/* Cuerpo flexible para contenido y botones */}
            <div className="card-body d-flex flex-column flex-grow-1">
                <h5 className="card-title">{props.titulo}</h5>
                
                {/* Descripción truncada */}
                <p 
                    className="card-text" 
                    style={{ 
                        flexGrow: 1, 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        display: '-webkit-box',
                        WebkitLineClamp: 3,   // Ajusta el número de líneas visibles
                        WebkitBoxOrient: 'vertical',
                        minHeight: '60px'      // Altura mínima para uniformidad
                    }}
                >
                    {props.descripcion}
                </p>

                <p className="card-text"><strong>Fecha de estreno:</strong> {props.fecha}</p>
                <p className="card-text"><strong>Rating:</strong> {props.rating}</p>
                <p className="card-text"><strong>Categoría:</strong> {props.categoria}</p>

                {/* Botones pegados abajo */}
                <div className="mt-auto d-flex justify-content-between pt-3">
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

export default SerieComponent;
