import styles from "./styles.module.css"

function Filter(props) {
	const { title, datas, id, stateChange } = props

	const onClickHandler = e => {
		stateChange(e.target.innerHTML)
	}

	return (
		<div className={`dropdown dropdown-hover ${styles.filter}`}>
			<label tabIndex={0} className="btn m-1">
				{title}
			</label>
			<ul
				tabIndex={0}
				className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
			>
				{datas.map(data => (
					<li key={`${id}-${data}`}>
						<div onClick={onClickHandler}>{data}</div>
					</li>
				))}
			</ul>
		</div>
	)
}

export default Filter
