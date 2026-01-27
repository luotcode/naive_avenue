import React from "react";
import { useNavigate } from "react-router-dom";
import "./directoryPage.css";
import logoUrl from "/logo.png";
import MenuOverlay from "../components/menuoverlay";

const works = [
	{ title: "TrustIn AI", artist: "Cẩm-Anh Lương", thumb: "/assets/trustin_AI.png", path: "/cam-anh-luong" },
	{ title: "Into The Eden Of Ambiguities: A Walk With AI", artist: "Đặng Khang Ninh", thumb: "/assets/Eden AI - Dang Khang Ninh.png", path: "/dang-khang-ninh" },
	{ title: "Art & Leisure (Crying)", artist: "Emily Sarten", thumb: "/assets/Art & Leisure (Crying) - Emily Sarten.png", path: "/emily-sarten" },
	{ title: "Artificial Divinities", artist: "Hà Thảo", thumb: "/assets/THE CHRONICLE OF ARTIFICIAL DIVINITY - Thảo Hà.png", path: "/ha-thao" },
	{ title: "you’re so exotic looking!", artist: "Hân Đào", thumb: "/assets/you are so exotic looking! - Hân Đào.png", path: "/han-dao-you-are-so-exotic-looking" },
	{ title: "đàn-ông.exe", artist: "Hân Đào", thumb: "/assets/Đàn ông - Hân Đào.png", path: "/han-dao-dan-ong" },
	{ title: "G9", artist: "Ivy Võ", thumb: "/assets/G9 - Ivy Vo.png", path: "/ivy-vo" },
	{ title: "Giấc mơ gi (cha)Pi ti", artist: "Lê Thanh Thảo", thumb: "/assets/Giac mo Chapiti - Le Thanh Thao.png", path: "/le-thanh-thao" },
	{
		title: "Diary of a self-proclaimed Schizo-approximating person or just another casual conversation with her muses",
		artist: "lphg",
		thumb: "/assets/LHPG.png",
		path: "/lphg",
	},
	{ title: "Derivative of Trio A", artist: "Lyon Nguyễn", thumb: "/assets/Derivative of Trio A - Lyon Nguyễn.png", path: "/lyon-nguyen" },
	{ title: "The AI dance with us!!", artist: "Nicola Bertoglio", thumb: "/assets/The AI Dance with Us! - Nicola Bertoglio.png", path: "/nicola-bertoglio" },
	{ title: "Re-Impression. Water Lilies, Water Lilies;", artist: "Nguyễn Thái Bảo", thumb: "/assets/Water lilies.png", path: "/nguyen-thai-bao" },
	{ title: "Kính chiếu AI", artist: "Nguyễn Hoàng Gia Bảo", thumb: "/assets/Nguyễn Hoàng Gia Bảo_.png", path: "/nguyen-hoang-gia-bao" },
	{ title: "Human Learning", artist: "Nguyễn Hoàng Giang", thumb: "/assets/Human Learning - Giang IT.png", path: "/nguyen-hoang-giang" },
	{ title: "Little monster dancing", artist: "Ricardo Bodini", thumb: "", path: "/ricardo-bodini" },
	{ title: "late summer days", artist: "Tais Koshino", thumb: "", path: "/tais-koshino" },
	{ title: "Nightscape", artist: "Valentin Sismann", thumb: "/assets/Nighscape - Sismann 2.png", path: "/valentin-sismann-nightscape" },
	{ title: "Picklesong", artist: "Valentin Sismann", thumb: "/assets/Valentin Sismann - Picklesong (2025)_.png", path: "/valentin-sismann-pickle-song" },
];

export default function DirectoryPage() {
	const navigate = useNavigate();

	return (
		<div className="directory-page">
			<button className="brand" onClick={() => navigate("/")} aria-label="Go to Home" title="Home">
				<img src={logoUrl} alt="Logo" />
			</button>

			<div className="menu">
				<MenuOverlay />
			</div>

			<div className="directory-shell">

				<div className="directory-grid" role="list">
					{works.map((work, idx) => (
						<button
							className="directory-card"
							role="listitem"
							type="button"
							onClick={() => navigate(work.path)}
							key={`${work.title}-${work.artist}`}
						>
							<div className="directory-thumb-wrap">
							{work.thumb ? (
								<div
									className="directory-thumb"
									style={{ backgroundImage: `url("${work.thumb}")` }}
									aria-hidden="true"
								/>
							) : (
								<div className="directory-thumb directory-thumb-empty">
									<div className="directory-placeholder-text">{work.artist}</div>
								</div>
								)}
								<div className="directory-number">{String(idx + 1).padStart(2, "0")}</div>
							</div>
							<div className="directory-text">
								<div className="directory-title">{work.title}</div>
								<div className="directory-artist">{work.artist}</div>
							</div>
						</button>
					))}
				</div>
			</div>
		</div>
	);
}
