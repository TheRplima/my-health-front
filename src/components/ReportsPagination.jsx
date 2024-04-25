import React from 'react';
import Pagination from 'react-bootstrap/Pagination';

const ReportsPagination = (props) => {

    const paginationData = props.paginationData;

    let items = [];
    if (paginationData?.links?.length > 0) {
        paginationData.links.map((link, index) => {
            //ignore the fisrt and last item and add elipsys on multiple of 5
            if (index !== 0 && index !== paginationData.links.length - 1) {
                if (index % 5 === 0) {
                    items.push(<Pagination.Ellipsis key={index} />);
                } else {
                    items.push(<Pagination.Item key={index} data-page={link.url} active={link.active}>{link.label}</Pagination.Item>);
                }
            }
        });
    }

    return (
        <Pagination>
            <Pagination.First data-page={paginationData.first_page_url} disabled={paginationData.current_page === 1 ? true : false} onClick={(event) => props.paginationClicked(event)} />
            <Pagination.Prev data-page={paginationData.prev_page_url} disabled={paginationData.prev_page_url ? false : true} onClick={(event) => props.paginationClicked(event)} />
            {items}
            <Pagination.Next data-page={paginationData.next_page_url} disabled={paginationData.next_page_url ? false : true} onClick={(event) => props.paginationClicked(event)} />
            <Pagination.Last data-page={paginationData.last_page_url} disabled={paginationData.current_page === paginationData.last_page ? true : false} onClick={(event) => props.paginationClicked(event)} />
        </Pagination>
    );
};

export default ReportsPagination;