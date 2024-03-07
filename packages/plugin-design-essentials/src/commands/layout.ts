import { Context } from "@imgly/plugin-core";
import { toSafeInteger } from "lodash";
import { computeMultiSelectionBounds } from "@imgly/plugin-utils";

export const layoutPagesFree =  async (ctx: Context, params: { blockIds?: number[]; padding?: number; }) => {
    const { block, scene } = ctx.engine;
    const bIds = block.findByType("//ly.img.ubq/page");
    const pIds = bIds.map(bId => block.getParent(bId))
    const pIdSet = new Set(pIds)
    if (pIdSet.size !== 1) return; 
    const pId = pIds[0]!;
    
    const pType = block.getType(pId);
    if (pType !== "//ly.img.ubq/stack" ) return;
    const sId = scene.get()!

    bIds.forEach((bId) => {
        block.appendChild(sId, bId);
    })
    block.destroy(sId)
}

export const layoutHorizontally = async (ctx: Context, params: { blockIds?: number[]; padding?: number; }) => {
    const { block } = ctx.engine;
    const {
        blockIds = block.findAllSelected(), padding = 0
    } = params;

    const isGroup = (blockIds.length === 1 && block.getType(blockIds[0]) !== '//ly.img.ubq/group');
    const isMultiSelection = blockIds.length > 1;

    if (!isGroup && !isMultiSelection) {
        return;
    };

    const children = isGroup ? block.getChildren(blockIds[0]) : blockIds;
    if (children.length === 0) return;


    let curXPos = block.getPositionX(children[0]);
    const curYPos = block.getPositionY(children[0]);
    children.forEach((childId: number) => {
        block.setPositionY(childId, curYPos);
        block.setPositionX(childId, curXPos);
        const width = block.getFrameWidth(childId);
        curXPos += width;
        curXPos += padding;
    });
};

export const layoutVertically = async (ctx: Context, params: { blockIds?: number[]; padding?: number; }) => {
    const { block } = ctx.engine;
    const {
        blockIds = block.findAllSelected(), padding = 0
    } = params;
    const isGroup = (blockIds.length === 1 && block.getType(blockIds[0]) !== '//ly.img.ubq/group');
    const isMultiSelection = blockIds.length > 1;

    if (!isGroup && !isMultiSelection) {
        return;
    };

    const children = isGroup ? block.getChildren(blockIds[0]) : blockIds;
    if (children.length === 0) return;

    const curXPos = block.getPositionX(children[0]);
    let curYPos = block.getPositionY(children[0]);
    children.forEach((childId: number) => {
        block.setPositionX(childId, curXPos);
        block.setPositionY(childId, curYPos);
        const height = block.getFrameHeight(childId);
        curYPos += height;
        curYPos += padding;
    });
};


export const layoutMasonry = async (ctx: Context, params: { blockIds?: number[]; cols?: number; paddingX?: number; paddingY?: number; }) => {
    const { block } = ctx.engine;
    let {
        blockIds = block.findAllSelected(), paddingX = 16, paddingY = 16, cols = 2
    } = params;


    cols = toSafeInteger(prompt("Enter the number of columns", "2"));
    const isGroup = (blockIds.length === 1 && block.getType(blockIds[0]) !== '//ly.img.ubq/group');
    const isMultiSelection = blockIds.length > 1;

    if (!isGroup && !isMultiSelection) {
        return;
    };

    const children = isGroup ? block.getChildren(blockIds[0]) : blockIds;
    const groupWidth = isGroup ? block.getFrameWidth(blockIds[0]) : computeMultiSelectionBounds(ctx, blockIds).width;
    const childWidth = groupWidth / cols - paddingX;

    console.log(children);
    const rowHeights: Array<number> = [];
    for (let i = 0; i < cols; i++) {
        rowHeights.push(0);
    }

    const curXPos = block.getPositionX(children[0]);
    const curYPos = block.getPositionY(children[0]);
    children.forEach((childId: number) => {
        const w = block.getFrameWidth(childId);
        const h = block.getFrameHeight(childId);
        const aspect = h / w;
        const newWidth = childWidth;
        const newHeight = aspect * newWidth;
        block.setWidth(childId, newWidth);
        block.setHeight(childId, newHeight);
        // get column with the "lowest" height 
        const minIndex = rowHeights.indexOf(Math.min(...rowHeights));
        console.log(minIndex, rowHeights[minIndex]);
        const xPos = curXPos + minIndex * (childWidth + paddingX);
        const yPos = curYPos + rowHeights[minIndex];
        rowHeights[minIndex] += newHeight + paddingY;
        block.setPositionX(childId, xPos);
        block.setPositionY(childId, yPos);
    });
};
