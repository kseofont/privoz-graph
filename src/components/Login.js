import { Dropdown } from 'react-bootstrap';
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { useEffect, useState } from "react";
import getPlayers from "../logic/getPlayers";

const client = new ApolloClient({
    uri: "https://privoz.lavron.dev/graphql/",
    cache: new InMemoryCache(),
});

function Login() {
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const playersData = await getPlayers(client);
            setPlayers(playersData);
        }

        fetchData();
    }, []);
    return (
        <div className="login vh-100 d-flex align-items-center justify-content-center"> {/* Added classes here */}
            <div className="text-center"> {/* Optionally add "text-center" for text alignment */}
                <div className="login-title mb-4"> {/* Added margin-bottom for spacing */}
                    <h3>Login</h3>
                </div>
                <div className="login-players">
                    <Dropdown>
                        <Dropdown.Toggle variant="primary" id="login-players__dropdown">
                            Select Players
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {players.map((player, index) => (
                                <Dropdown.Item key={index} href={"/game?player=" + player.id}> Player: {player.id}</Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
        </div>
    );

}

export default Login;
