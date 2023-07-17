const headerPageTitle = document.querySelector('.header__page-title')
const sidebarMenu = document.querySelector('.menu-sidebar')
const header = document.querySelector('.header')
const sidebarMenuActions = document.querySelector('.menu-sidebar__actions')
const bodySection = document.querySelector('.body')
const bodyMenu = document.querySelector('.body-menu__wrapper')
const bodyTable = document.querySelector('.body-table')
const bodyWrapper = document.querySelector('.body-wrapper')
const loading = document.querySelector('.loading')
const tableSettings = document.querySelector('.table-settings')

const isMobile = window.matchMedia('(any-pointer: coarse)').matches

window.addEventListener('load', function () {
	if (isMobile) {
		sidebarMenu.style.zIndex = Number(getComputedStyle(bodyWrapper).getPropertyValue('z-index')) + 1
		bodySection.style.paddingBottom = sidebarMenu.clientHeight + 10 + 'px'

		const settingsSections = tableSettings.querySelectorAll('section')
		settingsSections.forEach(section => {
			const spoilerBtn = document.querySelector(`[href="#${section.id}"]`)
			spoilerBtn.insertAdjacentHTML('afterend', `
			<div class="body-menu__spoiler">
				<div class="body-menu__spoiler-content">
				</div>
			</div>
			`)
			spoilerBtn.nextElementSibling.querySelector('.body-menu__spoiler-content').appendChild(section)
		})
		tableSettings.remove()
	} else {
		sidebarMenuActions.classList.add('active')
		sidebarMenu.style.minWidth = sidebarMenuActions.clientWidth + 'px'
		header.style.height = sidebarMenuActions.clientHeight + 'px'
		header.style.paddingLeft = sidebarMenuActions.clientWidth + 'px'
		// tableSettingsBlock.classList.add('active')

		openMenuSidebar()
		updatePageTitle()
	}
})

const menuBtn = document.querySelector('.menu-icon')
if (menuBtn) {
	menuBtn.addEventListener('click', function () {
		
		if (sidebarMenu.classList.contains('active')) {
			closeMenuSidebar()
		} else {
			openMenuSidebar()
		}
	})
}
//dynamic handler
document.addEventListener('click', function (e) {
	const target = e.target

	if (target.classList.contains('menu-item') && !target.classList.contains('not-selectable')) {
		target.parentElement.querySelector('.selected').classList.remove('selected')
		target.classList.add('selected')
		updatePageTitle()
	} else if (target.classList.contains('select-with-image__btn') && target.closest('.select-with-image__list.with-target')) {
		target.closest('.select-with-image').parentElement.querySelectorAll('.target.active').forEach(activeEl => {
			activeEl.classList.remove('active')
		})
		if (target.hasAttribute('data-target')) {
			const targetElem = document.querySelector(`#${target.getAttribute('data-target')}`)
			targetElem.classList.add('active')
		}
	} else if (target.classList.contains('delete') && target.closest('.multiSelect__tag')) {
		const tag = target.closest('.multiSelect__tag')
		selectedTags.delete(Number(tag.dataset.tagId))
		updateMultiSelect()
		tag.remove()
	} else if (target.classList.contains('multiSelect__list-item')) {
		const tagBox = multiSelect.querySelector('.multiSelect__tag-box')
		tagBox.insertAdjacentHTML('beforeend', `
		<div data-tag-id="${target.dataset.tagId}" class="multiSelect__tag" >${target.textContent}<button button class="delete" >&times;</button ></div >
		`)
		selectedTags.add(Number(target.dataset.tagId))
		updateMultiSelect()
	} else if (target.classList.contains('body-menu__item')) {

		e.preventDefault()
		const blockID = target.getAttribute('href').substr(1)
		document.getElementById(blockID).scrollIntoView({
			behavior: 'smooth',
		})
		bodyMenu.classList.add('lock')
		setTimeout(() => {
			bodyMenu.classList.remove('lock')
		}, 700)

		

		if (isMobile) {
			const spoiler = target.nextElementSibling

			if (target.classList.contains('active')) {
				target.classList.remove('active')
				spoiler.style.maxHeight = null
				spoiler.style.overflow = null
			} else {
				target.classList.add('active')
				spoiler.style.maxHeight = spoiler.scrollHeight + 'px'
				spoiler.style.overflow = 'visible'
			}

		} else {

			target.parentElement.querySelector('.body-menu__item.active')?.classList.remove('active')
			target.classList.add('active')
		}
	} else if (target.classList.contains('table-fix-cb')) {
		if (target.classList.contains('target-row')) {
			const tr = target.closest('tr')
			// tr.classList.toggle('row-fix')
			toggleFixRow(tr.rowIndex, tr.dataset.rowId)

		} else if (target.classList.contains('target-col')) {
			const th = target.closest('th')
			toggleFixColumn(th.cellIndex, th.dataset.colId)
		}
	} else if (target.classList.contains('table-icon-action')) {
		function markLast(type) {
			document.querySelector(`.${type}.last`)?.classList.remove('last')
			target.classList.add('last')
		}
		if (target.classList.contains('table-link-btn')) {
			markLast('table-link-btn')
		} else if (target.classList.contains('table-list-btn')) {
			markLast('table-list-btn')
		} else if (target.classList.contains('table-graph-btn')) {
			markLast('table-graph-btn')
			const graphPopupContainer = document.querySelector('#graph-popup-id').querySelector('.popup__content')
			const img = graphPopupContainer.querySelector('img')
			if (img.clientHeight > graphPopupContainer.clientHeight) {
				graphPopupContainer.style.height = graphPopupContainer.clientHeight + 'px'
			} else if (img.clientWidth > graphPopupContainer.clientWidth) (
				graphPopupContainer.style.width = graphPopupContainer.clientWidth + 'px'
			)
		}
	}
})

function updatePageTitle() {
	headerPageTitle.textContent = document.querySelector('.menu-item.selected .text').textContent
}
function openMenuSidebar() {

	sidebarMenu.classList.add('active')
	header.classList.remove('active')
	bodySection.style.marginLeft = sidebarMenu.clientWidth + 'px'
	bodySection.style.paddingTop = '10px'
	bodyMenu.style.top = bodySection.style.paddingTop

	//fix body-wrapper
	const sidebarWidth = sidebarMenuActions.clientWidth
	bodyWrapper.style.width = `calc(100vw - ${sidebarWidth + 20 + (window.innerWidth - document.documentElement.clientWidth) + 'px'})`
	bodyWrapper.style.left = sidebarWidth + 10 + 'px'

	updateFixRows()
	updateFixColumns()
}
function closeMenuSidebar() {
	sidebarMenu.classList.remove('active')
	header.classList.add('active')
	bodySection.style.marginLeft = 0;
	bodySection.style.paddingTop = header.clientHeight + 10 + 'px'
	bodyMenu.style.top = bodySection.style.paddingTop

	//fix body-wrapper
	bodyWrapper.style.width = `calc(100vw - ${(window.innerWidth - document.documentElement.clientWidth + 20) + 'px'})`
	bodyWrapper.style.left = '10px'

	updateFixRows()
	updateFixColumns()
}







document.addEventListener('click', function (el) {
	const target = el.target
	if (!target.closest('.select-with-image') && document.querySelector('.select-with-image__list.active')) {
		const allSelect = document.querySelectorAll('.select-with-image__list')
		Array.from(allSelect).map(e => e.classList.remove('active'))
	}
})


//dropdown
document.querySelectorAll('.select-with-image').forEach(dropdown => {
	const ddSelect = dropdown.querySelector('.select-with-image__field')
	let list = dropdown.querySelector('.select-with-image__list')
	const oldList = list
	if (dropdown.classList.contains('overlay')) {
		list = document.body.appendChild(oldList.cloneNode(true))
		list.classList.add('overlay')
	}
	const buttons = list.querySelectorAll('.select-with-image__btn')

	ddSelect.innerHTML = ''
	ddSelect.append(buttons[0]?.cloneNode(true) || '')


	ddSelect.addEventListener('click', function () {
		if (list.classList.contains('active')) {
			list.classList.remove('active')
		} else {
			list.classList.add('active')

			if (list.classList.contains('overlay')) {
				list.style.left = oldList.getBoundingClientRect().left + 'px'
				list.style.top = oldList.getBoundingClientRect().top + 'px'
			}
		}
	})
	buttons.forEach(btn => {
		btn.addEventListener('click', function () {
			list.classList.remove('active')
			ddSelect.innerHTML = ''
			ddSelect.append(btn.cloneNode(true))
		})
	})
})

const json = [
	{
		id: 1,
		name: 'html'
	},
	{
		id: 2,
		name: 'css'
	},
	{
		id: 3,
		name: 'js'
	},
]

const multiSelect = document.querySelector('.multiSelect')
const selectedTags = new Set()
if (multiSelect) {
	const input = multiSelect.querySelector('input')
	const list = multiSelect.querySelector('.multiSelect__list')
	updateMultiSelect()

	input.addEventListener('input', function () {

		if (input.value !== '') {
			list.classList.add('active')
		} else {
			list.classList.remove('active')
		}
	})
}
function updateMultiSelect() {
	const list = multiSelect.querySelector('.multiSelect__list')
	list.innerHTML = ''
	for (const tag of json) {
		if (!selectedTags.has(tag.id)) {
			list.insertAdjacentHTML('beforeend', `
			<li class="multiSelect__list-item" data-tag-id="${tag.id}">${tag.name}</li>
			`)
		}
	}
}

if (!isMobile) {
	const bodyMenuItems = document.querySelectorAll('.body-menu__item')
	const observedSections = document.querySelectorAll('.observed-section')
	const menuObserver = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {

				bodyMenuItems.forEach(item => {
					const id = item.getAttribute('href').substring(1)
					if (id === entry.target.id && !bodyMenu.classList.contains('lock')) {
						[...bodyMenuItems].forEach(i => i.classList.remove('active'))
						item.classList.add('active')
					}
				})
			}
		})
	}, {
		threshold: 0.01
	})
	observedSections.forEach(item => menuObserver.observe(item))
}



const toTopBtn = document.querySelector('.to-begin-table')
toTopBtn.addEventListener('click', function () {
	let yPos = document.querySelector('table').offsetTop
	if (header.classList.contains('active')) yPos -= header.clientHeight
	scrollTo({
		top: yPos,
		behavior: 'smooth'
	})
})

const tableObserverIn = new IntersectionObserver((entries) => {
	const entry = entries[0]
	if (entry.isIntersecting) {
		toTopBtn.classList.add('active')
	} else {
		toTopBtn.classList.remove('active')
	}
}, {
	rootMargin: '0px 0px -100% 0px'
})

tableObserverIn.observe(document.querySelector('tbody'))

//table fix logic
let fixedRows = {}
let fixedColumns = {}
function toggleFixRow(pos, id) {
	if (fixedRows[pos]) {
		delete fixedRows[pos]
	} else {
		fixedRows[pos] = id
	}
	updateFixRows()
}
function toggleFixColumn(pos, id) {
	if (fixedColumns[pos]) {
		delete fixedColumns[pos]
	} else {
		fixedColumns[pos] = id
	}
	updateFixColumns()
}

function updateFixRows() {
	const rows = document.querySelectorAll('[data-row-id]');
	[...rows].forEach(r => {
		r.classList.remove('row-fix');
		[...r.children].forEach(c => c.style.top = null)
	})

	const entries = Object.entries(fixedRows)
	let prevRowElem = null
	let yPos = header.classList.contains('active') && !isMobile ? header.clientHeight : 0
	for (const [pos, id] of entries) {
		if (prevRowElem) yPos += prevRowElem.getBoundingClientRect().height
		const row = document.querySelector(`[data-row-id="${id}"]`)
		row.classList.add('row-fix');
		[...row.children].forEach(c => c.style.top = yPos + 'px')
		prevRowElem = row
	}
}

function updateFixColumns() {
	const cells = [...document.querySelectorAll('th'), ...document.querySelectorAll('td')];
	[...cells].forEach(c => {
		c.classList.remove('col-fix')
		c.style.left = null
	})

	const entries = Object.entries(fixedColumns)
	let prevColElem = null
	let xPos = sidebarMenu.classList.contains('active') && !isMobile ? sidebarMenu.clientWidth : 0
	for (const [pos, id] of entries) {

		if (prevColElem) xPos += prevColElem.getBoundingClientRect().width

		const col = document.querySelector(`[data-col-id="${id}"]`)
		const colIndex = col.cellIndex
		const rows = document.querySelectorAll('[data-row-id]');
		[...rows].forEach(r => {
			const cell = r.children[colIndex]
			cell.style.left = xPos + 'px'
			cell.classList.add('col-fix');
		})
		prevColElem = col
	}
}

function resetFixedCells() {
	fixedColumns = {}
	fixedRows = {}
	updateFixRows()
	updateFixColumns()
	document.querySelectorAll('.table-fix-cb').forEach(cb => cb.checked = false)
}

const cbAllcb = document.querySelector('.all-cb-actions')
cbAllcb.addEventListener('change', function () {
	const allActionCb = document.querySelector('tbody').querySelectorAll('.action-cb')
	if (cbAllcb.checked) {
		allActionCb.forEach(c => c.checked = true)
	} else {
		allActionCb.forEach(c => c.checked = false)
	}
})

const allTooltips = document.querySelectorAll('.tooltip')
allTooltips.forEach(tooltip => {
	tooltip.addEventListener('mouseover', function () {
		const tip = tooltip.querySelector('.tip')
		tip.classList.remove('bottom')

		if (tip.getBoundingClientRect().top < 0) {
			tip.classList.add('bottom')
		}
	})
})

const allPopup = document.querySelectorAll('.popup')
allPopup.forEach(popup => {
	const buttons = document.querySelectorAll(`[data-popup-id="${popup.id}"]`)
	for (const btn of buttons) {
		btn.addEventListener('click', function () {
			popup.classList.add('active')
			document.body.style.overflow = 'hidden'
		})
	}

	const closeBtn = popup.querySelector('.popup__close')
	closeBtn.addEventListener('click', function () {
		popup.classList.remove('active')
		document.body.style.overflow = 'auto'
	})
})

const bodyMenuSearch = document.querySelector('.body-menu__search-btn')
const sortTableBtn = document.querySelector('.col-sort__btn')
bodyMenuSearch.addEventListener('click', function () {
	if (bodyTable.classList.contains('active')) bodyTable.classList.remove('active')
	loading.classList.add('active')
	loading.style.margin = '20px 0'
	sortTableBtn.classList.remove('active')
	loading.scrollIntoView({
		behavior: 'smooth'
	})
	resetFixedCells()
	setTimeout(() => {
		loading.classList.remove('active')
		loading.style.margin = null
		bodyTable.classList.add('active')
	}, 2000);
})

sortTableBtn.addEventListener('click', function () {
	const tbody = document.querySelector('tbody')
	const thead = document.querySelector('thead')
	sortTableBtn.classList.toggle('active')

	loading.classList.add('active')
	tbody.style.filter = 'blur(8px)'
	loading.style.position = 'absolute'
	loading.style.top = scrollY + window.innerHeight - (window.innerHeight - thead.getBoundingClientRect().bottom) / 2 - loading.clientHeight / 2 + 'px'
	loading.style.left = scrollX + (window.innerWidth + isMobile ? sidebarMenu.clientWidth + 10 : 0) / 2 - loading.clientWidth / 2 + 'px'
	resetFixedCells()

	setTimeout(() => {
		tbody.style.filter = null
		loading.style.position = null
		loading.style.top = null
		loading.style.left = null
		loading.classList.remove('active')
		bodyTable.classList.add('active')
	}, 2000);
})

