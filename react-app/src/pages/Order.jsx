import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Order() {
    const location = useLocation();
    const [id, setId] = useState(location.state.flowerId != null ? location.state.flowerId : 1);
    const [flower, setFlower] = useState([]);
    const [mennyiseg, setMennyiseg] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:3333/api/flowers/${id}`)
        .then(async res => {
            const data = await res.json();
            setFlower(data);
        })
        .catch((err) => console.log(err))
        .finally();
    }, []);

    const handleOrder = async (e) => {
        e.preventDefault();

        if (mennyiseg <= 0 || mennyiseg > flower[0].keszlet || mennyiseg === "" || mennyiseg % 1 !== 0) {
            alert("⚠️Érvénytelen mennyiség!⚠️");
            console.log("⚠️Érvénytelen mennyiség!⚠️");
            navigate("/flowers");
        } else {
            let categoryId = null;
            alert("✅Sikeres rendelés!✅");

            //get categoryId
            await fetch("http://localhost:3333/api/categories")
            .then(async res => {
                const data = await res.json();

                for(let i = 0; i < data.length; i++) {
                    if(data[i].nev === flower[0].kategoria_nev) {
                        categoryId = data[i].id;
                        break;
                    }
                }
            })
            .catch((err) => console.log(err))
            .finally();

            //remove ordered quantity from stock
            await fetch(`http://localhost:3333/api/flowers/${id}`, {
                method: "PUT",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    {
                        nev: flower[0].nev,
                        leiras: flower[0].leiras,
                        ar: flower[0].ar,
                        keszlet: flower[0].keszlet - mennyiseg,
                        kepUrl: flower[0].kepUrl,
                        kategoriaId: categoryId,
                    }
                ),
                });
            navigate("/flowers");

        }
    };

    const handleChange = (e) => {
        if (e.target.value < 0 || e.target.value > flower[0].keszlet) {

        } else {
            setMennyiseg(e.target.value);
        }
    };

    return (
        <div>
            <header>
                <Link to="/">
                    <img src="sunflower.jpg" alt="fa" id="logo" />
                </Link>
                <h1>Nevenincs Bt.</h1>
                <h2>Vetőmagok - Mindenféle, minden mennyiségben</h2>
            </header>
            <main className="container">
                <h2>{flower[0]?.nev}{flower[0]?.kategoriaId}</h2>
                <div className="row">
                    <div className="col-md-6">
                        <img
                            src={flower[0]?.kepUrl}
                            alt={flower[0]?.nev}
                            className="img-thumbnail"
                        />
                    </div>
                    <div className="col-md-6">
                        <p>
                            {flower[0]?.leiras}
                        </p>
                        <span id="ar">Ár: {flower[0]?.ar} Ft</span>
                        {flower[0]?.keszlet != 0 ? 
                        (
                            <form className="d-flex flex-column gap-3 mt-3">
                                <div>
                                    <span>Mennyiség: </span>
                                    <input
                                        type="number"
                                        name="mennyiseg"
                                        id="mennyiseg"
                                        min="1"
                                        value={mennyiseg}
                                        onChange={handleChange}
                                        max={flower[0]?.keszlet}
                                        required
                                    />
                                    </div>
                                    <button
                                        className="btn btn-warning btn-lg "
                                        style={{ maxWidth: "200px" }}
                                        onClick={handleOrder}
                                    >
                                        Megrendelem
                                </button>
                            </form>
                        ) 
                        : 
                        (
                            <span
                                style={{
                                    color: "red",
                                    fontWeight: "bold",
                                    fontSize: 19,
                                    display: "flex",
                                    marginTop: "20px",
                                }}
                            >
                                Jelenleg nincs a termékből készleten, keresse fel oldalunkat
                                később!
                            </span>
                        )
                        }
                    </div>
                </div>
            </main>
            <footer className="container-fluid">
                <div className="row">
                    <div className="col-md-4 col-lg-2">
                        <h3>Nyitvatartás:</h3>
                    </div>
                    <div className="col-md-8 col-lg-4">
                        <ul>
                            <li>Hétfő-Péntek: 8-17 óráig</li>
                            <li>Szombat: 8-13 óráig</li>
                            <li>Vasárnap: 9-12 óráig</li>
                        </ul>
                    </div>
                    <div className="col-md-4 col-lg-2">
                        <h3>Kapcsolat:</h3>
                    </div>
                    <div className="col-md-8 col-lg-4">
                        <ul>
                            <li>06-30/111-1111</li>
                            <li>06-70/111-1111</li>
                            <li>nevenincsbt@gmail.com</li>
                        </ul>
                    </div>
                </div>
            </footer>
        </div>
    );
}