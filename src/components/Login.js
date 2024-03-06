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
        <div className="login">
            <div className="login-title">
                <h3>Login</h3>
            </div>
            <div className="login-players">
                <Dropdown>
                    <Dropdown.Toggle variant="primary" id="login-players__dropdown">
                        Select Players
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {players.map((player) => (
                            <Dropdown.Item href={"/game?player=" + player.id}> Player: {player.id}</Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
                <div className="test"> <h4>show me WITH GOD BLESS</h4></div>
                <div className="test"> <h4>v991</h4></div>
            </div>
        </div>
    );
}

export default Login;
