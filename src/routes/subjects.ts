import express from "express";
import { db } from "../db/index.js";
import { and, desc, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";
import { departments, subjects } from "../db/schema/app.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const { search, department, page = 1, limit = 10 } = req.query;

        const currentPage = Math.max(1, +page);
        const LimitPerPage = Math.max(1, +limit);
        const offset = (currentPage - 1) * LimitPerPage;
        const filterConditions = [];

        if (search) {
            filterConditions.push(
                or(
                    ilike(subjects.name, `%${search}%`),
                    ilike(subjects.code, `%${search}%`),
                )
            );
        }

        if (department) {
            filterConditions.push(eq(subjects.departmentId, +department));
            const deptPattern = `%${String(department).replace(/\s+/g, '%')}%`;
            filterConditions.push(ilike(departments.name, deptPattern));
        }

        const whereClause = filterConditions.length > 0 ? and(...filterConditions) : undefined;
        const countResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(subjects)
            .where(whereClause)
            .leftJoin(departments, eq(subjects.departmentId, departments.id));

        const totalItems = countResult[0]?.count ?? 0;

        const subjectsList = await db
            .select({
                ...getTableColumns(subjects),
                departmentName: { ...getTableColumns(departments) },
            }).from(subjects).leftJoin(departments, eq(subjects.departmentId, departments.id))
            .where(whereClause)
            .orderBy(desc(subjects.createdAt))
            .limit(LimitPerPage)
            .offset(offset);


        res.status(200).json({
            data: subjectsList,
            pagination: {
                totalItems,
                totalPages: Math.ceil(totalItems / LimitPerPage),
                currentPage,
                limit: LimitPerPage,
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
