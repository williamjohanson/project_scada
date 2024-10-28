import React, { useState, useEffect } from 'react';
import './Home.css';
import './Dialler.css';
import Sidebar from '../components/Sidebar';
import OperatorCard from '../components/OperatorCard';

function Dialler() {
    const [config, setConfig] = useState(null);
    const [menuType, setMenuType] = useState('global');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isEnabled, setIsEnabled] = useState(false);
    const [operators, setOperators] = useState([]);
    const [newOperator, setNewOperator] = useState({
        name: '', role: '', phone: '', priority: '', onCall: false, photo: ''
    });

    const apiUrl = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        fetch(`${apiUrl}/api/config`)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
                return response.json();
            })
            .then(data => {
                const updatedConfig = {
                    ...data,
                    logoUrl: `${apiUrl}${data.logoUrl}`,
                };
                setConfig(updatedConfig);
            })
            .catch(error => console.error('Error fetching config:', error));
    }, []);

    useEffect(() => {
        fetch(`${apiUrl}/api/operators`)
            .then(response => response.json())
            .then(data => {
                const orderedOperators = sortOperators(data.operators || []);
                setOperators(orderedOperators);
            })
            .catch(error => console.error('Error fetching operators:', error));
    }, []);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const handleToggle = () => setIsEnabled(prev => !prev);

    const sortOperators = (ops) => {
        // Place "on call" operator first with priority 1, then by priority order
        const onCallOperator = ops.find(op => op.onCall);
        const otherOperators = ops
            .filter(op => !op.onCall)
            .sort((a, b) => a.priority - b.priority);

        // Reset priority based on order
        if (onCallOperator) onCallOperator.priority = 1;
        otherOperators.forEach((op, index) => op.priority = index + 2);

        return onCallOperator ? [onCallOperator, ...otherOperators] : otherOperators;
    };

    const handleToggleOnCall = (id) => {
        const updatedOperators = operators.map(operator => ({
            ...operator,
            onCall: operator.id === id,
        }));
        setOperators(sortOperators(updatedOperators));
        saveOperators(updatedOperators);
    };

    const addOperator = () => {
        if (operators.length >= 10) return;
        const nextPriority = operators.length + 1;
        const newOperatorData = {
            ...newOperator,
            id: Date.now(),
            priority: Math.min(nextPriority, operators.length),
        };
        const updatedOperators = sortOperators([...operators, newOperatorData]);
        setOperators(updatedOperators);
        setNewOperator({ name: '', role: '', phone: '', priority: 2, onCall: false });
        saveOperators(updatedOperators);
    };

    const deleteOperator = id => {
        const updatedOperators = operators.filter(operator => operator.id !== id);
        setOperators(updatedOperators);
        saveOperators(updatedOperators);
    };

    const saveOperators = updatedOperators => {
        fetch((`${apiUrl}/api/operators`), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ operators: updatedOperators })
        })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
            return response.json();
        })
        .catch(error => console.error('Error saving operators:', error));
    };

    const handleInputChange = e => {
        const { name, value } = e.target;
        setNewOperator({ ...newOperator, [name]: value });
    };

    if (!config) return <div>Loading System Configuration...</div>;

    return (
        <div className={`homepage ${sidebarOpen ? 'with-sidebar' : 'no-sidebar'}`}>
            <Sidebar menuType={menuType} machines={config.machines} isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            <header className="header">
                <img src={config.logoUrl} alt="Sawmill Logo" className="logo animated-logo" />
                <h1 className="site-title">{config.siteName} Dialler</h1>
            </header>

            <div className="main-content">
                <div className="toggle-slider-container">
                    <h2>Dialler</h2>
                    <div className={`toggle-slider ${isEnabled ? 'enabled' : 'disabled'}`} onClick={handleToggle}>
                        <span className="slider-circle"></span>
                    </div>
                    <p className="status-text">Status: {isEnabled ? 'Enabled' : 'Disabled'}</p>
                </div>
            </div>

            <div className="operators-sidebar">
                <h2>Operators</h2>
                <div className="operator-grid">
                    {operators.map(operator => (
                        <OperatorCard
                            key={operator.id}
                            operator={operator}
                            onDelete={() => deleteOperator(operator.id)}
                            onToggleOnCall={() => handleToggleOnCall(operator.id)}
                        />
                    ))}
                </div>

                {operators.length < 10 && (
                    <div className="add-operator-form">
                        <h3>Add New Operator</h3>
                        <input type="text" name="name" value={newOperator.name} onChange={handleInputChange} placeholder="Name" />
                        <input type="text" name="role" value={newOperator.role} onChange={handleInputChange} placeholder="Role" />
                        <input type="text" name="phone" value={newOperator.phone} onChange={handleInputChange} placeholder="Phone Number" />
                        <input type="text" name="priority" value={newOperator.priority} onChange={handleInputChange} placeholder="Priority" />
                        <label>
                            On Call:
                            <input
                                type="checkbox"
                                name="onCall"
                                checked={newOperator.onCall}
                                onChange={e => setNewOperator({ ...newOperator, onCall: e.target.checked })}
                            />
                        </label>
                        <button onClick={addOperator}>Add Operator</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dialler;
