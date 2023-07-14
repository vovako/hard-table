const headerPageTitle = document.querySelector('.header__page-title')
const sidebarMenu = document.querySelector('.menu-sidebar')
const header = document.querySelector('.header')
const sidebarMenuActions = document.querySelector('.menu-sidebar__actions')
const bodySection = document.querySelector('.body')
const bodyMenu = document.querySelector('.body-menu__wrapper')

const isMobile = window.matchMedia('(any-pointer: coarse)').matches

window.addEventListener('load', function () {
	if (!isMobile) {
		sidebarMenu.style.minWidth = sidebarMenuActions.clientWidth + 'px'
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
		target.parentElement.querySelector('.body-menu__item.active').classList.remove('active')
		target.classList.add('active')
		e.preventDefault()
		const blockID = target.getAttribute('href').substr(1)
		document.getElementById(blockID).scrollIntoView( {
			behavior: 'smooth',
		})
		bodyMenu.classList.add('lock')
		setTimeout(() => {
			bodyMenu.classList.remove('lock')
		}, 700)
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
}
function closeMenuSidebar() {
	sidebarMenu.classList.remove('active')
	header.classList.add('active')
	bodySection.style.marginLeft = 0;
	bodySection.style.paddingTop = header.clientHeight + 10 + 'px'
	bodyMenu.style.top = bodySection.style.paddingTop
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

const bodyMenuItems = document.querySelectorAll('.body-menu__item')
const observedSections = document.querySelectorAll('.observed-section')
const menuObserver = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			console.log(entry.boundingClientRect);

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