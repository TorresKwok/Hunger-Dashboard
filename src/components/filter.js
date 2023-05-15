import styles from "./styles.module.css"

function Filter(props) {
	const { title, datas, id, stateChange } = props

	const onClickHandler = e => {
		stateChange(e.target.value)
	}

	return (
		// <div className={`dropdown dropdown-hover ${styles.filter}`}>
		// 	<label tabIndex={0} className="btn m-1">
		// 		{title}
		// 	</label>
		// 	<ul
		// 		tabIndex={0}
		// 		className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
		// 	>
		// 		{datas.map(data => (
		// 			<li key={`${id}-${data}`}>
		// 				<div onClick={onClickHandler}>{data}</div>
		// 			</li>
		// 		))}
		// 	</ul>
		// </div>

		<div className={`form-control w-full max-w-xs ${styles.filter}`}>
			<label className='label'>
				<span className='label-text'>{title}</span>
			</label>
			<select
				className='select select-bordered'
				onChange={onClickHandler}
				defaultValue={"DEFAULT"}
			>
				<option disabled value='DEFAULT'>
					Pick one
				</option>
				{datas.map(data => (
					<option onClick={onClickHandler} key={`${id}-${data}`}>
						{data}
					</option>
				))}
			</select>
		</div>
	)
}

export default Filter
