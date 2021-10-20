// function swap(items, leftIndex, rightIndex){
//     var temp = items[leftIndex];
//     items[leftIndex] = items[rightIndex];
//     items[rightIndex] = temp;
//     console.log(items.map(x => x.trackNumber));
// }

//if left is bigger: 1
//if right is bigger: -1
//if equal: 0
function compare(leftItem, rightItem, compareWith) {
    if(leftItem[compareWith] == rightItem[compareWith]) { 
        return 0;
    }
    else if(leftItem[compareWith] > rightItem[compareWith]){
        return 1;
    }
    else
        return -1;
}

// function partition(items, left, right, compareWith) {
//     var pivot   = items[Math.floor((right + left) / 2)], //middle element
//         i       = left, //left pointer
//         j       = right; //right pointer
//     while (i <= j) {
//         //if left > right
//         while (compare(items[i], pivot, compareWith) == 1) {
//             i++;
//         }
//         //if left < right
//         while (compare(items[j], pivot, compareWith) == -1) {
//             j--;
//         }
//         if (i <= j && compare(items[j], pivot, compareWith) != 0) {
//             swap(items, i, j);
//         }
//         i++;
//         j--;
//     }
//     return i;
// }

// export function quickSort(items, left, right, compareWith) {
//     var index;
//     if (items.length > 1) {
//         index = partition(items, left, right, compareWith); //index returned from partition
//         if (left < index - 1) { //more elements on the left side of the pivot
//             quickSort(items, left, index - 1, compareWith);
//         }
//         if (index < right) { //more elements on the right side of the pivot
//             quickSort(items, index, right, compareWith);
//         }
//     }
//     return items;
// }


export function insertionSortAscending(inputArr, compareWith) {
    let n = inputArr.length;
        for (let i = 1; i < n; i++) {
            // Choosing the first element in our unsorted subarray
            let current = inputArr[i];
            // The last element of our sorted subarray
            let j = i-1; 
            
            while ((j > -1) && compare(current, inputArr[j], compareWith) == 1) {
                inputArr[j+1] = inputArr[j];
                j--;
            }
            inputArr[j+1] = current;
        }
    return inputArr;
}

export function insertionSortDescending(inputArr, compareWith) {
    let n = inputArr.length;
        for (let i = 1; i < n; i++) {
            // Choosing the first element in our unsorted subarray
            let current = inputArr[i];
            // The last element of our sorted subarray
            let j = i-1; 
            
            while ((j > -1) && compare(current, inputArr[j], compareWith) == -1) {
                inputArr[j+1] = inputArr[j];
                j--;
            }
            inputArr[j+1] = current;
        }
    return inputArr;
}