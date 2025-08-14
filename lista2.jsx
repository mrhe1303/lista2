const { useState, useEffect } = React;

const ToDoList = () => {
    const [inputValue, setInputValue] = useState('');
    const [chores, setChores] = useState([]);
    const [user, setUser] = useState('alesanchezr');

    useEffect(() => {
        fetchChores();
    }, []);

    const fetchChores = () => {
        fetch(`https://playground.4geeks.com/todo/users/${user}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar tareas');
            }
            return response.json();
        })
        .then(data => {
            if (data.todos) {
                setChores(data.todos);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim() !== '') {
            addChore(inputValue);
            setInputValue('');
        }
    };

    const addChore = (choreText) => {
        const newChore = { label: choreText, is_done: false };

        fetch(`https://playground.4geeks.com/todo/todos/${user}`, {
            method: "POST",
            body: JSON.stringify(newChore),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(() => {
            fetchChores();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    const deleteChore = (id) => {
        fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
            method: "DELETE"
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar tarea');
            }
            fetchChores();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    const clearAllChores = () => {
        fetch(`https://playground.4geeks.com/todo/users/${user}`, {
            method: "DELETE"
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al limpiar tareas');
            }
            setChores([]);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    return (
        <div className="caja">
            <h1 className="titulo">Quehaceres</h1>
            <div className="lista">
                <input className="barra"
                type="text"
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                value={inputValue}
                placeholder="¿Qué vas a hacer?"
                />
                <div className="listaTareas">
                    {chores.length === 0 ? (
                        <p className="mensaje">No hay quehaceres, añadir quehacer</p>
                    ) : (
                        <ul>
                            {chores.map(chore => (
                                <li key={chore.id} className="item">
                                    {chore.label}
                                    <button
                                    className="eliminar"
                                    onClick={() => deleteChore(chore.id)}
                                    >
                                        x
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {chores.length > 0 && (
                    <button
                        className="limpiar"
                        onClick={clearAllChores}
                    >
                        Borrar tareas
                    </button>
                )}
            </div>
        </div>
    )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ToDoList />);
