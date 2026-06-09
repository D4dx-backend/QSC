import { GetIcon } from '../../../../icons';

const Popup = ({ options, handleOptionClick }) => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-evenly',
                boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.2)',
                width: '200px',
                height: 'auto',
                padding: '10px',
                backgroundColor: 'white',
                borderRadius: '5px',
                position: 'absolute',
                zIndex: '999',
                color: 'grey',
            }}
        >
            {/* Render icon options */}
            {options.map((option) => (
                <div
                    key={option.label}
                    style={{
                        width: '50px', // Set the width of each icon container
                        textAlign: 'center',
                        margin: '5px', // Add margin between icon containers
                    }}
                    onClick={() => handleOptionClick(option)}
                >
                    <GetIcon icon={option.icon} /> {/* Render icon */}
                    {/* <span style={{ marginLeft: '5px' }}>{option.label}</span> */}
                </div>
            ))}
        </div>
    );
};

export default Popup;
