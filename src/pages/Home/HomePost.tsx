import { useNavigate } from 'solid-app-router';
import { Component } from "solid-js";
import { styled } from 'solid-styled-components';
import { PostI } from "../../App";


import { FaSolidLocationDot } from 'solid-icons/fa'
import { BsCalendarDateFill } from 'solid-icons/bs'
import { IconText } from '../../components/IconText';


export const HomePost: Component<{ post: PostI, class?: string }> = (props) => {

	const navigate = useNavigate()


	const maxLetters = (parseInt((window.innerWidth / 100).toFixed(0)) - 1) * 10

	const cutTitle = props.post.title.length > (maxLetters <= 32 ? maxLetters : 32) ? props.post.title.substring(0, (maxLetters <= 32 ? maxLetters : 32)).concat("...") : props.post.title

	return (
		<>
			<HomePostStyle class={props.class} onClick={() => navigate(`/post/${props.post.id}`)}>
				<div class='image-div'>
					<img class="post-image" src={props.post.images[ 0 ]}></img>
				</div>
				<div class="content">
					<div class="top">
						<span class="title">{cutTitle || "title"}</span>
						<div class="tags">
							{/* <span>TAGS</span> */}
						</div>
					</div>
					<div class="bottom">
						<div class="left">

							{/* <span><FaSolidLocationDot /> {props.post.address !== null ? props.post.address : 'Nieznany'}</span>
							<span><BsCalendarDateFill /> {props.post.created_at !== null ? props.post.created_at.toString() : 'unknown'}</span> */}
							<IconText>
								<FaSolidLocationDot />
								<span style={{ "margin-left": "5px" }}>{props.post.address ? props.post.address : 'Nieznany'}</span>
							</IconText>
							<IconText>
								<BsCalendarDateFill />
								<span style={{ "margin-left": "5px" }}>{props.post.created_at ? props.post.created_at.toString() : 'unknown'}</span>
							</IconText>

						</div>
					</div>
				</div>

			</HomePostStyle>
		</>
	)
}

const HomePostStyle = styled("div")(() => {
	return {
		// minWidth: "340px",
		width: "100%",
		minHeight: "100px",
		maxWidth: "640px",
		// maxHeight: "100px",
		height: "100%",

		display: "flex",
		transition: "scale 50ms",

		backgroundColor: "#383838",
		".image-div": {
			height: "100%",
			display: "flex",
			flexDirection: "column",
			alignContent: "center",
			alignItems: "center",

			".post-image": {
				objectFit: "cover",
				minWidth: "150px",
				maxWidth: "40%",
				maxHeight: "100px",
				minHeight: "100px",
				// height: "100px",
				borderRadius: "10px",
				boxShadow: "4px 0 4px 0 rgba(0%, 0%, 0%, 25%)"
			},
		},

		borderRadius: "10px",
		marginTop: "10px",


		".content": {
			display: "flex",
			flexDirection: "column",
			width: "100%",
			margin: "10px",

			".top": {
				display: "flex",
				height: "100%",
				flexDirection: "column",

				color: "#FFFFFF",

				".title": {
					fontSize: "90%",
					fontWeight: "bolder"
				},

				".tags": {
					fontSize: "80%"
				}
			},

			".bottom": {
				display: "flex",
				flexDirection: "row",

				color: "#C5C5C5",

				".left": {
					display: "flex",
					flexDirection: "column",
					width: "100%",
					fontSize: "80%",
				}
			}
		}
	}
})