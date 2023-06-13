import './App.css';
import {useEffect, useState} from "react";
import axios from "axios";

function App() {
    const [tasks, setTasks] = useState([]);
    const [completed, setCompleted] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [id, setId] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const baseURL = 'http://localhost:3000/tasks/';

    useEffect(() => {

        axios.get(baseURL).then((response) => {
            setTasks(response.data);
        });
    }, []);

    const handleToggleComplete = (id) => {
        axios.put(baseURL + id + '/complete').then((response) => {
            const newTasks = tasks.map((task) => {
                if (task.id === id) {
                    task.completed = task.completed ? 0 : 1;
                }
                return task;
            });
            setTasks(newTasks);
        });
    }

    const handleDelete = (id) => {
        axios.delete(baseURL + id).then((response) => {
            const newTasks = tasks.filter((task) => task.id !== id);
            setTasks(newTasks);
        });
    }

    const handleAdd = (name, description) => {
        const id = tasks.length + 1;
        const newTask = {id, name, description, completed: 0};
        axios.post(baseURL, newTask).then((response) => {
            setTasks([...tasks, newTask]);
        });
    }

    const handleEdit = (id, name, description) => {
        const newTask = {id, name, description, completed: 0};
        axios.put(baseURL + id, newTask).then((response) => {
            const newTasks = tasks.map((task) => {
                if (task.id === id) {
                    task.name = name;
                    task.description = description;
                }
                return task;
            });
            setTasks(newTasks);
        });
    }

    const handleFormEdit = (task) => {

        setId(task.id);
        setName(task.name);
        setDescription(task.description);
        setIsEditing(true);
    }

    const cancelEdit = () => {
        setId('');
        setName('');
        setDescription('');
        setIsEditing(false);
    }

    return (
        <div className={'divcenter'}>
            <h1 className={'h1'}>Tarefas</h1>
            <ul className={'ul'}>
                {tasks.map((task) => (
                    <li key={task.id} className={'li'}>
                        <h2 className={'number'}>{task.id}</h2>
                        <h2 className={'h2'}>{task.name}</h2>
                        <p>{task.description}</p>
                        <p className={'number'}>{task.completed}</p>
                        <button
                            className={'button'} onClick={() => handleToggleComplete(task.id)}>{task.completed ? "Descompletar" : "Completar"}</button>
                        <button className={'button'} onClick={() => handleDelete(task.id)}>Deletar</button>
                        <button className={'button'} onClick={() => handleFormEdit(task)}>Editar</button>
                    </li>
                ))}
            </ul>
            <form>
                {!isEditing ?
                    <div>
                        <input className={'input'} type="text" placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)}/>
                        <input className={'input'} type="text" placeholder="Descrição" value={description}
                               onChange={(e) => setDescription(e.target.value)}/>
                        <button className={'button1'} onClick={() => handleAdd(name, description)}>Adicionar</button>
                    </div>
                    :
                    <div>
                        <input className={'input'} type="text" placeholder="ID" value={id} onChange={(e) => setId(e.target.value)}/>
                        <input className={'input'} type="text" placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)}/>
                        <input className={'input'} type="text" placeholder="Descrição" value={description}
                               onChange={(e) => setDescription(e.target.value)}/>
                        <button className={'button2'} onClick={() => handleEdit(id, name, description)}>Editar</button>
                        <button className={'button'} onClick={() => cancelEdit()}>Cancelar</button>
                    </div>
                }
            </form>
        </div>
    );
}

export default App;
