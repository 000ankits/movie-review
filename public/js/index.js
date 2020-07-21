const comText = document.querySelector('#reviewText');
const comSubBtn = document.querySelector('#submitReview');
const comCancBtn = document.querySelector('#cancelReview');
const comCreateBtn = document.querySelector('#createReview');

function reviewCreate() {
	comText.value = '';
	comText.style.display = 'block';
	comSubBtn.style.display = 'block';
	comCancBtn.style.display = 'block';
	comCreateBtn.style.display = 'none';
}

function cancelReview() {
	comText.value = '';
	comText.style.display = 'none';
	comSubBtn.style.display = 'none';
	comCancBtn.style.display = 'none';
	comCreateBtn.style.display = 'block';
}

function submitReview() {
	comText.style.display = 'none';
	comSubBtn.style.display = 'none';
	comCancBtn.style.display = 'none';
	comCreateBtn.style.display = 'block';
	document.querySelector('#reviewForm').submit();
}
