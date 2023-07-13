const headerPageTitle = document.querySelector('.header__page-title')
const sidebarMenu = document.querySelector('.menu-sidebar')
const header = document.querySelector('.header')
const sidebarMenuActions = document.querySelector('.menu-sidebar__actions')
const bodySection = document.querySelector('.body')
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
	}
})

function updatePageTitle() {
	headerPageTitle.textContent = document.querySelector('.menu-item.selected .text').textContent
}
function openMenuSidebar() {
	sidebarMenu.classList.add('active')
	header.classList.remove('active')
	bodySection.style.marginLeft = sidebarMenu.clientWidth + 'px'
	bodySection.style.paddingTop = 0
}
function closeMenuSidebar() {
	sidebarMenu.classList.remove('active')
	header.classList.add('active')
	bodySection.style.marginLeft = 0;
	bodySection.style.paddingTop = header.clientHeight + 10 + 'px'
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
	const list = dropdown.querySelector('.select-with-image__list')
	const buttons = list.querySelectorAll('.select-with-image__btn')

	ddSelect.innerHTML = ''
	ddSelect.append(buttons[0]?.cloneNode(true) || '')

	ddSelect.addEventListener('click', function () {
		list.classList.toggle('active')
		const active = document.querySelector('.select-with-image__list.active')
		if (active && active != list) {
			active.classList.remove('active')
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